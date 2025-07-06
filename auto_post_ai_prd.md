# Product Requirements Document (PRD)
**Product Name:** AutoPost AI for LinkedIn  
**Document Owner / Date:** Ryan Katayi – 06 Jul 2025

---

## 1. Purpose & Vision
Knowledge‑worker and creator pipelines are still manual: drafting, optimising, scheduling and posting LinkedIn content eats hours each week. **AutoPost AI** will let a user drop an idea (or even just a URL), generate a context‑aware LinkedIn post, schedule it for peak engagement, and publish automatically—hands‑off from first prompt to live post.

---

## 2. Goals & Success Metrics
| Goal | KPI / Target | Measurement |
|------|--------------|-------------|
| Cut weekly post‑creation time | ≤ 3 min per post (‑90 %) | In‑app timers |
| Boost engagement vs user’s historical avg | ≥ 20 % lift in reactions + comments | LinkedIn analytics |
| Retention | 40 % weekly active after 4 weeks | Cohort analysis |
| Compliance | 0 API violations / account blocks | LinkedIn Dev Portal |

---

## 3. Personas
1. **Solo Founder “Kaylib”** – wants thought‑leadership posts without spending evenings writing.  
2. **Marketing Manager “Tumi”** – manages five exec accounts, needs predictable cadence.  
3. **Career Switcher “Neo”** – building a personal brand; lacks copy‑writing chops.

---

## 4. Problem Statement
*LinkedIn ROI is high, but creating, timing, and posting quality content is tedious and fragmented across writing tools, schedulers, and LinkedIn itself.*

---

## 5. Solution Overview
A web app (Next.js + Supabase backend) that:
1. Accepts a topic/URL/bullet‑points from the user.  
2. Uses an LLM prompt chain to produce: headline, hook, body, hashtags, and optional image prompt.  
3. Predicts best publish time per account via historical engagement stats + regional benchmarks.  
4. Lets user approve/edit, then schedules via LinkedIn Marketing API.  
5. Posts automatically and pulls engagement metrics back into a dashboard.  
6. Provides iteration prompts (e.g., “boost reach – add a question”) and A/B experiments.

---

## 6. Feature List & Prioritisation (MoSCoW)
| ID | Feature | Must | Should | Could | Notes |
|----|---------|------|--------|-------|-------|
| F1 | LinkedIn OAuth & token refresh | ✔︎ | | | Handle expired tokens gracefully |
| F2 | Prompt‑to‑Post AI generation | ✔︎ | | | LLM + prompt templates |
| F3 | Scheduler with time‑zone detection | ✔︎ | | | Peak‑time algorithm |
| F4 | One‑click approve & autopost | ✔︎ | | | |
| F5 | Post history & engagement analytics | | ✔︎ | | Graphs / CSV export |
| F6 | Team / multi‑account workspace | | ✔︎ | | Roles & permissions |
| F7 | Image generation (DALL‑E, SD) | | | ✔︎ | CTA images |
| F8 | A/B variant testing | | | ✔︎ | Randomised scheduling |
| F9 | Browser extension “Quick Post” | | | ✔︎ | Capture highlighted text |

---

## 7. High‑Value User Stories
* **As a founder**, I paste a blog link and get a ready‑to‑post summary thread in ≤ 10 s.
* **As a marketer**, I set up five executives, queue a week of posts, and never re‑enter credentials.
* **As a user**, I edit the AI draft, press “schedule”, and the app handles posting and reporting.
* **As a power user**, I compare A/B variants and automatically scale the winner.

---

## 8. Functional Requirements
| Req‑ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| FR‑01 | Authenticate via LinkedIn OAuth 2.0 | User completes login, access token stored encrypted; refresh handled without manual re‑auth |
| FR‑02 | Generate post copy with style sliders (tone, length, POV) | Draft reflects chosen parameters > 90 % of time |
| FR‑03 | Scheduler calculates optimal UTC time | Uses past 90 days engagement + global benchmarks |
| FR‑04 | Auto‑post via LinkedIn Post API | Post appears on feed ≤ 60 s after scheduled time |
| FR‑05 | Retrieve analytics every 6 h | Likes, comments, impressions stored for charts |

---

## 9. Non‑Functional Requirements
* **Security:** Encrypt tokens (AES‑256); SOC‑2 controls roadmap.  
* **Scalability:** 10 k daily actives; 50 posts/sec peak.  
* **Latency:** Draft generation ≤ 10 s (P95).  
* **Availability:** 99.5 % monthly SLA.  
* **Compliance:** LinkedIn Platform Guidelines v2.9 (May 2025).

---

## 10. Assumptions & Dependencies
* LinkedIn continues to allow third‑party posting for authorised apps.  
* LLM provider uptime ≥ 99 %.  
* Users grant necessary posting permissions.

---

## 11. Open Questions
1. Will auto‑posting require LinkedIn Marketing Partner approval?  
2. Should we support custom images/GIFs at MVP?  
3. Pricing model—seat‑based vs usage tiers?  
4. GDPR/POPIA data‑processing addendum for EU/ZA users?

---

## 12. Milestones / Timeline (aggressive)
| Date | Milestone |
|------|-----------|
| **15 Aug 2025** | Alpha: OAuth, AI draft, manual copy‑paste export |
| **30 Sep** | Beta: Scheduler + auto‑posting to sandbox accounts |
| **31 Oct** | GA v1.0: Analytics dashboard, payments |
| **Q1 2026** | Teams, A/B testing, browser extension |

---

## 13. Metrics & Analytics
* Core funnel: idea → draft → scheduled → posted → engaged.  
* Cohort retention, active seats, LTV:CAC.  
* Post quality score: engagement per 1 k impressions vs benchmark.

---

## 14. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| LinkedIn API rate‑limits | High | Medium | Exponential backoff + batching |
| Policy change banning auto‑posting | High | Low | Maintain partnership status; monitor policy feeds |
| Poor draft relevance | Medium | Medium | Prompt tuning; user feedback loop |
| Token revocation breaks schedule | Medium | High | Daily token health check; email alerts |

---

## 15. Out of Scope (MVP)
* Posting to other platforms (X, Instagram, etc.).  
* Mobile native apps.  
* Deep content‑ideation research (topic suggestions).

---

## 16. Appendix – Tech Stack Snapshot
* **Frontend:** Next.js (app router), shadcn/ui, Tailwind.  
* **Backend:** Supabase (Postgres, RLS), Edge Functions for schedulers.  
* **AI:** OpenAI GPT‑4o function‑calling pipeline; fallback Llama‑3 local model.  
* **Infra:** Vercel + Supabase; scheduled jobs via Vercel Cron + durable KV.  
* **Observability:** PostHog, Sentry.

---

*End of PRD*

