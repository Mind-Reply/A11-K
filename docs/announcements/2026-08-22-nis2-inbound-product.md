# Announcement 02 — NIS2 inbound self-assessment is live

**Date:** 22 August 2026
**Author:** Angel L. Krastev, founder
**Status:** Public. Inbound only. Not legal advice. Not a cold-email engine.

---

## EN — NIS2 / ЗКС inbound self-assessment

A company-submitted classifier for the amended Bulgarian Cybersecurity Act (ЗКС / NIS2) is now live as a local HTML page.

**What it does:**

A Sofia company fills in its sector, size, and cyber-hygiene fields. The system returns:

- Preliminary bracket: **essential / important / out-of-scope / review-required**
- Vulnerability score **0–100**
- Missing hygiene controls (ISO 27001, incident plan, risk policy, supply-chain controls)
- Entity fine ceiling vs management-body administrative fine range
- 24 / 72 / 30-hour incident clock
- Next reversible steps

**What it does NOT do:**

- No Commercial Register scrape
- No RegiX / APIS connector
- No personal-email harvest
- No automated cold-email node (`buildOutreachBg()` throws)
- No legal opinion or certified audit

**Legal basis encoded:**

- Law: Закон за изменение и допълнение на Закона за киберсигурност
- State Gazette: бр. 17 от 13.02.2026
- In force: 2026-02-17
- Grace period ended: 2026-06-01
- Essential entity fine: up to €10M or 2% of global turnover
- Important entity fine: up to €7M or 1.4% of global turnover
- Management body administrative fine: €500–€5,000 (not the corporate ceiling)
- Incident reporting: 24h early warning / 72h notification / 30-day final report

**Sources:**

- Schoenherr: Bulgaria implements NIS-2 Directive
- Kinstellar: Bulgaria implements the NIS-2 Directive

---

## BG — Входяща самооценка ЗКС / NIS2

Входящият класификатор по Закона за киберсигурност (ЗКС / NIS2) е стартиран като локална HTML страница.

**Какво прави:**

Софийско дружество попълва сектор, размер и полета за киберхигиена. Системата връща:

- Предварителен обхват: **съществен / важен / извън обхват / за ръчен преглед**
- Оценка на уязвимост **0–100**
- Липсващи контроли (ISO 27001, план за инциденти, политика за риск, верига на доставки)
- Корпоративен таван на глоби спрямо административни глоби за ръководен орган
- Часовник за инциденти: 24ч / 72ч / 30 дни
- Следващи обратими стъпки

**Какво НЕ прави:**

- Без скрейп на Търговския регистър
- Без RegiX / APIS конектор
- Без извличане на лични имейли
- Без автоматизирани студени писма (`buildOutreachBg()` хвърля грешка)
- Без правно становище или сертифициран одит

**Правна основа:**

- Закон: Закон за изменение и допълнение на Закона за киберсигурност
- Държавен вестник: бр. 17 от 13.02.2026
- В сила от: 2026-02-17
- Преходният период приключи: 2026-06-01
- Глоба за съществен субект: до €10 млн. или 2% от глобалния оборот
- Глоба за важен субект: до €7 млн. или 1.4% от глобалния оборот
- Административна глоба за ръководен орган: €500–€5,000 (не е корпоративният таван)
- Известяване при инцидент: 24ч ранно предупреждение / 72ч уведомление / 30 дни финален доклад

---

## Monetization (allowed later, not active now)

1. Inbound self-assessment report — after the company requests it.
2. Paid implementation — only through a named, contracted Sofia cyber/legal partner.
3. ResellerPro / MindReply ops bundle — for firms already paying for hosting/comms.

No list-buying. No scraped ЕИК + Управител packs.

## Links

- Self-assessment page: `site/official/nis2.html`
- Classifier source: `src/nis2Scout.js`
- Product spec: `docs/NIS2_INBOUND_PRODUCT.md`
- Founder page: `site/official/index.html`
