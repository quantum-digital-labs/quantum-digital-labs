# Quantum Digital Labs Pvt Ltd — Website Build Brief

Build a professional marketing website for **Quantum Digital Labs Pvt Ltd**.

| Field | Value |
| --- | --- |
| Company | Quantum Digital Labs Pvt Ltd |
| Document type | Website creation brief |
| Status | Draft |
| Last updated | 2026-08-20 |

---

## 1. Goal

Ship a fast, credible, conversion-focused company website that:

- Introduces Quantum Digital Labs Pvt Ltd
- Explains services clearly
- Shows proof of work
- Drives inquiries via Contact

---

## 2. Recommended stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Styling | CSS variables + modern CSS (or Tailwind if preferred) |
| Hosting | Vercel |
| Forms | Server action → email (e.g. Resend) or CRM |
| Analytics | Plausible or GA4 |
| Repo | Single app under this project folder |

---

## 3. Pages to build

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Brand + value prop + CTAs |
| `/services` | Services | Offerings and outcomes |
| `/work` | Work | Case study index |
| `/work/[slug]` | Case study | Project detail |
| `/about` | About | Company story, principles, team |
| `/contact` | Contact | Inquiry form + email |
| `/privacy` | Privacy | Legal |
| `/terms` | Terms | Legal |

### Global chrome

- **Header:** logo/wordmark, nav (Services, Work, About), primary CTA → Contact
- **Footer:** nav, company name (Quantum Digital Labs Pvt Ltd), email, social, Privacy/Terms, © year

---

## 4. Home page structure

### First viewport (hero)

Keep the hero tight:

1. Brand: **Quantum Digital Labs** (Pvt Ltd in footer/legal only if preferred)
2. One headline
3. One short supporting sentence
4. CTA group: **Start a project** + **View work**
5. One dominant full-bleed visual (product/atmosphere — not abstract-only)

### Below the fold

1. What we do (short)
2. Services snapshot → `/services`
3. Featured work (2–3 cases) → `/work`
4. Process (3–4 steps)
5. Final CTA → `/contact`

---

## 5. Content placeholders

### Positioning

> Quantum Digital Labs Pvt Ltd builds and scales digital products — strategy, design, and engineering in one lab.

### Tagline options

1. Built with precision.
2. Digital products, engineered.
3. From idea to impact.

### Services (edit as needed)

1. Product strategy & discovery
2. UI/UX design
3. Web & app engineering
4. Growth & optimization

### Contact form fields

- Name (required)
- Email (required)
- Company (optional)
- Project type (optional)
- Message (required)
- Submit

---

## 6. Design rules

- Brand-first first viewport (brand must read as the hero signal)
- Expressive typography — avoid Inter / Roboto / Arial / system as the identity fonts
- Atmosphere via gradients, texture, or real imagery — not flat single-color pages
- Default: no cards; cards only when they wrap a real interaction
- One job per section: one headline + short support
- 2–3 intentional motions (hero entrance, work reveal, CTA hover)
- Avoid generic purple-gradient / cream-serif-terracotta / broadsheet newspaper looks
- Fully responsive (mobile + desktop)
- Accessibility target: WCAG 2.2 AA

### Color tokens (fill in)

```css
:root {
  --color-bg: ;
  --color-fg: ;
  --color-accent: ;
  --color-muted: ;
  --color-surface: ;
}
```

---

## 7. Implementation checklist

### Setup

- [ ] Initialize Next.js + TypeScript project
- [ ] Add base layout (header, footer, fonts, CSS variables)
- [ ] Configure metadata, favicon, OG image
- [ ] Set company legal name in footer: Quantum Digital Labs Pvt Ltd

### Pages

- [ ] Home
- [ ] Services
- [ ] Work index + 2–3 case study stubs
- [ ] About
- [ ] Contact (+ working form)
- [ ] Privacy & Terms

### Quality

- [ ] Mobile layout pass
- [ ] Keyboard / focus states
- [ ] SEO titles & descriptions per page
- [ ] Sitemap + robots
- [ ] Analytics
- [ ] Deploy to production domain

---

## 8. SEO defaults

- Title pattern: `{Page} · Quantum Digital Labs`
- Meta description ~150–160 characters per page
- Open Graph + Twitter cards
- Canonical URLs
- Company entity name in schema/JSON-LD (optional): `Quantum Digital Labs Pvt Ltd`

---

## 9. Open decisions

- [ ] Final tagline
- [ ] Color system & fonts
- [ ] Domain name
- [ ] Contact email
- [ ] Real case studies vs placeholders for launch
- [ ] Form destination (email vs CRM)

---

## 10. How to use this file

1. Confirm open decisions in §9
2. Fill design tokens and real copy
3. Build pages in the order of the checklist in §7
4. Ship Phase 1 (all core routes + working contact form)

**Phase 2 (later):** CMS, blog/insights, more case studies, careers.
