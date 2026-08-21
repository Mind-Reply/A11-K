# Announcement 01 — Sofia Tech Ledger is live

**Date:** 22 August 2026
**Author:** Angel L. Krastev, founder
**Status:** Public. Local-first. Fixture data. No live market claims yet.

---

## EN — Sofia Tech Ledger is live

**The Sofia Tech Ledger (Софийски Технологичен Регистър)** is now running as a local-first, automated daily bulletin for Sofia's SME digitalization, EU funding, and NIS2 compliance landscape.

What it does, every day:

1. Pulls digital-intensity, registration, and funding signals from open data sources (Eurostat `isoc_e_dii`, data.egov.bg, TED procurement).
2. Computes a **Digital Readiness Index (0–100)**, daily intensity delta, 7-day funding velocity, and sector gap-to-EU.
3. Renders a bilingual (BG/EN) HTML bulletin, SVG chart, social pack, and SHA-256-verified ledger entry.
4. Classifies NIS2 exposure from a self-submitted inbound form — no register scrape, no cold email.

Today's run (22 Aug 2026, fixture provider):

- Readiness index: **52/100**
- Daily intensity delta: **+0.15 pp**
- 7-day fintech velocity: **$20.0M**
- Open NIS2 findings: **2**
- Ledger height: **2**, tip verified `2546610387aa…`
- 21/21 unit tests passing
- Ghost/X publishing: **skipped** (no credentials — stays draft)

Cloud target: **Google Cloud project `mind-reply-496111`** (MIND REPLY). Bound in config only. No VM, bucket, function, or API key created.

---

## BG — Софийски Технологичен Регистър е стартиран

**Софийският Технологичен Регистър** вече работи като локална, автоматизирана дневна сводка за дигитализацията на софийските МСП, ЕС финансирането и съответствието с NIS2.

Какво прави всеки ден:

1. Извлича сигнали за дигитална интензивност, регистрации и финансиране от отворени източници (Eurostat, data.egov.bg, TED).
2. Изчислява **индекс на цифрова готовност (0–100)**, дневна делта, 7-дневна финансова скорост и секторно изоставане спрямо ЕС.
3. Генерира двуезичен (БГ/ЕН) HTML бюлетин, SVG графика, социален пакет и SHA-256 верифициран запис в регистъра.
4. Класифицира NIS2 обхват чрез входяща самооценка — без скрейп на регистри, без студени писма.

Днешното изпълнение (22 авг. 2026, детерминистичен образец):

- Индекс на цифрова готовност: **52/100**
- Дневна делта: **+0.15 п.п.**
- 7-дневна финтех скорост: **$20.0M**
- Отворени NIS2 констатации: **2**
- Височина на регистъра: **2**, tip верифициран
- 21/21 теста минават
- Публикуване в Ghost/X: **пропуснато** (без кредитни — остава чернова)

Облачна цел: **GCP проект `mind-reply-496111`** (MIND REPLY). Свързан само в конфигурацията. Няма създаден VM, bucket, функция или API ключ.

---

## What is NOT claimed

- No live market data — today's run uses deterministic fixtures.
- No Eurostat/NSI proof attached yet for the 2% / 87% claims — they stay unpublished.
- No GCP resources provisioned.
- No legal opinion, no certified audit, no closed customers.
- No scraped personal data, no RegiX access, no unsolicited outreach.

## Links

- Local bulletin: `out/sofia-tech-ledger-2026-08-22.html`
- Founder page: `site/official/index.html`
- NIS2 self-assessment: `site/official/nis2.html`
- A11-K public site: https://mind-reply.github.io/A11-K/
- A11-K issue #8: https://github.com/Mind-Reply/A11-K/issues/8
- GCP console: https://console.cloud.google.com/welcome?project=mind-reply-496111
