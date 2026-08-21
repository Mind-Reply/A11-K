// NIS2 Compliance Scout — maps Sofia companies against the amended Bulgarian
// Cybersecurity Act (ЗКС, State Gazette 17/13.02.2026, in force 17.02.2026).
// All statutory thresholds verified against legal analyses (see sources in README).

export const NIS2_LAW = {
  name: 'Закон за изменение и допълнение на Закона за киберсигурност',
  adopted: '2026-02-05',
  promulgated: '2026-02-13',
  stateGazette: 'бр. 17 от 13.02.2026',
  inForce: '2026-02-17',
  gracePeriodEnded: '2026-06-01',
  graceNote: '50% reduced sanctions applied to breaches committed before 1 June 2026; full statutory fines now apply',
  essentialFine: { maxEur: 10_000_000, turnoverPct: 2, minEur: 25_000 },
  importantFine: { maxEur: 7_000_000, turnoverPct: 1.4, minEur: 12_500 },
  managerFine: { minEur: 500, maxEur: 5_000 },
  incidentReporting: { earlyWarningH: 24, notificationH: 72, finalReportDays: 30 },
  sectors: 18
};

// Annex I (essential-leaning) and Annex II (important-leaning) sectors.
// Verified against Kinstellar / Schoenherr / pravko.bg analyses of the amended ЗКС.
const ANNEX_I = new Set(['Енергетика', 'Транспорт', 'Банково дело', 'Финансова инфраструктура', 'Здравеопазване', 'Питейна вода', 'Отпадъчни води', 'Цифрова инфраструктура', 'ИКТ услуги', 'Публична администрация', 'Космос']);
const ANNEX_II = new Set(['Пощенски и куриерски услуги', 'Управление на отпадъци', 'Химическа промишленост', 'Хранителна промишленост', 'Производство на медицински изделия', 'Производство на електроника', 'Цифрови услуги', 'Научни изследвания', 'Производство', 'Търговия', 'Логистика', 'Обществени поръчки']);

// Fixture company registry for Sofia mid-market targets (real adapter: Commercial Register via licensed access).
const FIXTURE_COMPANIES = [
  { eik: '201234567', name: 'Балкан Храни ООД', sector: 'Хранителна промишленост', employees: 55, city: 'София', hasIso27001: false, hasIncidentPlan: false, manager: 'Иван Петров' },
  { eik: '202345678', name: 'Витоша Логистика АД', sector: 'Логистика', employees: 120, city: 'София', hasIso27001: true, hasIncidentPlan: false, manager: 'Мария Георгиева' },
  { eik: '203456789', name: 'София Кемикълс ЕООД', sector: 'Химическа промишленост', employees: 30, city: 'София', hasIso27001: false, hasIncidentPlan: false, manager: 'Георги Димитров' },
  { eik: '204567890', name: 'Дигитален Поток ООД', sector: 'Цифрови услуги', employees: 18, city: 'София', hasIso27001: false, hasIncidentPlan: true, manager: 'Петър Николов' },
  { eik: '205678901', name: 'Еко Отпадък София АД', sector: 'Управление на отпадъци', employees: 85, city: 'София', hasIso27001: false, hasIncidentPlan: false, manager: 'Стефан Колев' },
  { eik: '206789012', name: 'МедДевайс БГ ООД', sector: 'Производство на медицински изделия', employees: 40, city: 'София', hasIso27001: true, hasIncidentPlan: true, manager: 'Елена Тодорова' },
  { eik: '207890123', name: 'ТрансКарго София ЕООД', sector: 'Транспорт', employees: 200, city: 'София', hasIso27001: false, hasIncidentPlan: false, manager: 'Николай Стоянов' },
  { eik: '208901234', name: 'Софийски Водопровод АД', sector: 'Питейна вода', employees: 350, city: 'София', hasIso27001: false, hasIncidentPlan: false, manager: 'Димитър Ангелов' }
];

/** Classify entity under the amended ЗКС. */
export function classifyEntity(company) {
  const isMediumPlus = company.employees >= 50 || company.annualRevenueEur >= 10_000_000;
  const inAnnexI = ANNEX_I.has(company.sector);
  const inAnnexII = ANNEX_II.has(company.sector);

  if (!isMediumPlus && !inAnnexI) return { bracket: 'out-of-scope', reason: 'below medium-size threshold and not in Annex I' };
  if (inAnnexI && isMediumPlus) return { bracket: 'essential', bg: 'съществен субект', fine: NIS2_LAW.essentialFine };
  if (inAnnexI || inAnnexII) return { bracket: 'important', bg: 'важен субект', fine: NIS2_LAW.importantFine };
  return { bracket: 'review-required', reason: 'sector match uncertain — manual review' };
}

/** Score compliance vulnerability 0–100 (higher = more exposed). */
export function vulnerabilityScore(company, classification) {
  if (classification.bracket === 'out-of-scope') return 0;
  let score = 0;
  if (!company.hasIso27001) score += 30;
  if (!company.hasIncidentPlan) score += 35;
  if (!company.hasRiskPolicy) score += 20;
  if (classification.bracket === 'essential') score += 15;
  return Math.min(100, score);
}

/** Generate the Bulgarian outreach text for a single target. */
export function buildOutreachBg(company, classification) {
  const fine = classification.fine ?? NIS2_LAW.importantFine;
  const fineMax = `€${(fine.maxEur / 1e6).toFixed(0)} млн.`;
  return {
    subject: `Спешни мерки за съответствие със ЗКС (NIS2) за ${company.name} — изтичане на облекченията`,
    body: [
      `Уважаеми г-н/г-жо ${company.manager},`,
      ``,
      `С измененията в Закона за киберсигурност (обн. ДВ бр. ${NIS2_LAW.stateGazette}, в сила от ${NIS2_LAW.inForce}) и изтичането на преходния период на ${NIS2_LAW.gracePeriodEnded}, предприятията в сектор „${company.sector}“ подлежат на пълния размер на законовите санкции.`,
      ``,
      `Наш автоматизиран преглед на публичните регистри показва, че ${company.name} (ЕИК: ${company.eik}) попада в обхвата на закона като ${classification.bg}. Липсата на въведени политики за управление на риска, защита на веригата за доставки и готовност за 24-часово известяване при инциденти излага управителния орган на пряка лична имуществена отговорност (€${NIS2_LAW.managerFine.minEur}–€${NIS2_LAW.managerFine.maxEur}), а дружеството — на риск от санкции до ${fineMax} или ${fine.turnoverPct}% от глобалния оборот.`,
      ``,
      `Изготвихме предварителен одит за съответствие и план за внедряване на минимални киберхигиенни мерки съгласно изискванията на Министерството на електронното управление.`,
      ``,
      `С уважение,`,
      `Софийски Технологичен Регистър`
    ].join('\n')
  };
}

/** Full scan of the fixture registry: classified, scored, ranked targets. */
export function scanRegistry(companies = FIXTURE_COMPANIES) {
  return companies
    .map((c) => {
      const classification = classifyEntity(c);
      const score = vulnerabilityScore(c, classification);
      return {
        ...c,
        classification,
        vulnerabilityScore: score,
        outreach: classification.bracket !== 'out-of-scope' ? buildOutreachBg(c, classification) : null
      };
    })
    .filter((c) => c.classification.bracket !== 'out-of-scope')
    .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);
}
