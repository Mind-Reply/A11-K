// NIS2 inbound classifier — maps a self-submitted Sofia company against the
// amended Bulgarian Cybersecurity Act (ЗКС).
//
// Encoded from public legal analyses of ДВ бр. 17 / 13.02.2026.
// Not legal advice. Verify against the official State Gazette text before any
// commercial claim. This module never scrapes registers, never stores personal
// contact lists, and never sends outreach.

export const NIS2_LAW = {
  name: 'Закон за изменение и допълнение на Закона за киберсигурност',
  adopted: '2026-02-05',
  promulgated: '2026-02-13',
  stateGazette: 'бр. 17 от 13.02.2026',
  inForce: '2026-02-17',
  gracePeriodEnded: '2026-06-01',
  graceNote:
    'Public legal analyses describe a 50% reduced-sanction window for breaches committed before 1 June 2026. Full statutory entity fines are treated as applicable after that date. Confirm against the official ДВ text.',
  essentialFine: { maxEur: 10_000_000, turnoverPct: 2, minEur: 25_000 },
  importantFine: { maxEur: 7_000_000, turnoverPct: 1.4, minEur: 12_500 },
  managerFine: { minEur: 500, maxEur: 5_000 },
  incidentReporting: { earlyWarningH: 24, notificationH: 72, finalReportDays: 30 },
  sectors: 18,
  sources: [
    'https://www.schoenherr.eu/content/bulgaria-implements-nis-2-directive-key-changes-to-the-cybersecurity-act',
    'https://www.kinstellar.com/insights/detail/2803/bulgaria-implements-the-nis-2-directive-key-changes-to-the-cybersecurity-act',
  ],
};

const ANNEX_I = new Set([
  'Енергетика',
  'Транспорт',
  'Банково дело',
  'Финансова инфраструктура',
  'Здравеопазване',
  'Питейна вода',
  'Отпадъчни води',
  'Цифрова инфраструктура',
  'ИКТ услуги',
  'Публична администрация',
  'Космос',
]);

const ANNEX_II = new Set([
  'Пощенски и куриерски услуги',
  'Управление на отпадъци',
  'Химическа промишленост',
  'Хранителна промишленост',
  'Производство на медицински изделия',
  'Производство на електроника',
  'Цифрови услуги',
  'Научни изследвания',
  'Производство',
  'Търговия',
  'Логистика',
  'Обществени поръчки',
]);

export const SECTORS = [...ANNEX_I, ...ANNEX_II];

// Synthetic Sofia mid-market examples for local demos only.
// Fake EIKs. No real people. Never use as an outreach list.
const FIXTURE_COMPANIES = [
  { eik: 'FIXTURE-201234567', name: 'Балкан Храни ООД', sector: 'Хранителна промишленост', employees: 55, city: 'София', hasIso27001: false, hasIncidentPlan: false },
  { eik: 'FIXTURE-202345678', name: 'Витоша Логистика АД', sector: 'Логистика', employees: 120, city: 'София', hasIso27001: true, hasIncidentPlan: false },
  { eik: 'FIXTURE-203456789', name: 'София Кемикълс ЕООД', sector: 'Химическа промишленост', employees: 30, city: 'София', hasIso27001: false, hasIncidentPlan: false },
  { eik: 'FIXTURE-204567890', name: 'Дигитален Поток ООД', sector: 'Цифрови услуги', employees: 18, city: 'София', hasIso27001: false, hasIncidentPlan: true },
  { eik: 'FIXTURE-205678901', name: 'Еко Отпадък София АД', sector: 'Управление на отпадъци', employees: 85, city: 'София', hasIso27001: false, hasIncidentPlan: false },
  { eik: 'FIXTURE-206789012', name: 'МедДевайс БГ ООД', sector: 'Производство на медицински изделия', employees: 40, city: 'София', hasIso27001: true, hasIncidentPlan: true },
  { eik: 'FIXTURE-207890123', name: 'ТрансКарго София ЕООД', sector: 'Транспорт', employees: 200, city: 'София', hasIso27001: false, hasIncidentPlan: false },
  { eik: 'FIXTURE-208901234', name: 'Софийски Водопровод АД', sector: 'Питейна вода', employees: 350, city: 'София', hasIso27001: false, hasIncidentPlan: false },
];

export function classifyEntity(company) {
  const isMediumPlus = Number(company.employees) >= 50 || Number(company.annualRevenueEur) >= 10_000_000;
  const inAnnexI = ANNEX_I.has(company.sector);
  const inAnnexII = ANNEX_II.has(company.sector);

  if (!isMediumPlus && !inAnnexI) {
    return { bracket: 'out-of-scope', bg: 'извън обхват (предварително)', reason: 'below medium-size threshold and not in Annex I' };
  }
  if (inAnnexI && isMediumPlus) {
    return { bracket: 'essential', bg: 'съществен субект (предварително)', fine: NIS2_LAW.essentialFine };
  }
  if (inAnnexI || inAnnexII) {
    return { bracket: 'important', bg: 'важен субект (предварително)', fine: NIS2_LAW.importantFine };
  }
  return { bracket: 'review-required', bg: 'нуждае се от ръчен преглед', reason: 'sector match uncertain — manual review' };
}

export function vulnerabilityScore(company, classification) {
  if (classification.bracket === 'out-of-scope') return 0;
  let score = 0;
  if (!company.hasIso27001) score += 30;
  if (!company.hasIncidentPlan) score += 35;
  if (!company.hasRiskPolicy) score += 20;
  if (classification.bracket === 'essential') score += 15;
  return Math.min(100, score);
}

export function buildSelfAssessment(company, classification = classifyEntity(company)) {
  const fine = classification.fine ?? NIS2_LAW.importantFine;
  const score = vulnerabilityScore(company, classification);
  const gaps = [];
  if (!company.hasIso27001) gaps.push({ id: 'iso27001', bg: 'Липсва ISO/IEC 27001 или еквивалентна сертификация', en: 'No ISO/IEC 27001 or equivalent certification recorded' });
  if (!company.hasIncidentPlan) gaps.push({ id: 'incident', bg: 'Липсва план за 24/72-часово известяване при инцидент', en: 'No 24/72-hour incident notification plan recorded' });
  if (!company.hasRiskPolicy) gaps.push({ id: 'risk', bg: 'Липсва документирана политика за управление на киберриска', en: 'No documented cyber-risk policy recorded' });
  if (!company.hasSupplyChainControls) gaps.push({ id: 'supply', bg: 'Липсват контроли за веригата на доставки', en: 'No supply-chain cyber controls recorded' });

  return {
    asOf: company.asOf || new Date().toISOString().slice(0, 10),
    companyName: company.name || 'Неназовано дружество',
    eik: company.eik || null,
    sector: company.sector || null,
    city: company.city || 'София',
    classification,
    vulnerabilityScore: score,
    gaps,
    entityFineCeiling: classification.fine
      ? `до €${(fine.maxEur / 1e6).toFixed(0)} млн. или ${fine.turnoverPct}% от глобалния оборот`
      : null,
    managerAdminFine: `административни глоби за ръководен орган в диапазон €${NIS2_LAW.managerFine.minEur}–€${NIS2_LAW.managerFine.maxEur} (не са корпоративният таван от €10 млн.)`,
    incidentClock: `${NIS2_LAW.incidentReporting.earlyWarningH}ч ранно предупреждение / ${NIS2_LAW.incidentReporting.notificationH}ч уведомление / ${NIS2_LAW.incidentReporting.finalReportDays} дни финален доклад`,
    nextStepsBg: [
      'Потвърдете обхвата с юрист по ЗКС — този отчет е предварителен класификатор, не правно становище.',
      'Документирайте политика за киберриск, план за непрекъснатост и 24-часов канал за инциденти.',
      'Запазете входяща консултация през официалната страница. Не изпращаме нежелани писма.',
    ],
    disclaimer:
      'Не е правен съвет. Не е одит. Не е доказателство за съответствие. Класификацията е предварителна и зависи от самодекларирани полета. Личните глоби за ръководен орган не са равни на корпоративния таван от €10 млн. / 2%.',
  };
}

/** @deprecated Outreach generation is blocked. Kept only so old imports fail loudly if misused. */
export function buildOutreachBg() {
  throw new Error('Blocked: unsolicited NIS2 outreach is disabled. Use buildSelfAssessment() for inbound reports.');
}

export function scanRegistry(companies = FIXTURE_COMPANIES) {
  return companies
    .map((c) => {
      const classification = classifyEntity(c);
      const assessment = buildSelfAssessment(c, classification);
      return {
        name: c.name,
        eik: c.eik,
        sector: c.sector,
        city: c.city,
        fixture: true,
        classification,
        vulnerabilityScore: assessment.vulnerabilityScore,
        assessment,
      };
    })
    .filter((c) => c.classification.bracket !== 'out-of-scope')
    .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);
}
