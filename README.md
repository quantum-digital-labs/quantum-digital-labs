# Quantum Digital Labs Pvt. Ltd.

Corporate website platform for technology services, staffing, training, internships, projects, and digital marketing.

## Status

**PARTS 1–12 (frontend loops)** are largely complete: routing, chrome, home, about, services, careers/apply, internships/apply, projects/demo, portfolio/case study, blog, contact, quote, success/404, and auth foundation.

| Part | Scope | Status |
| --- | --- | --- |
| 1 | Project Setup | Done |
| 2 | Routing Architecture | Done |
| 3 | Header & Footer | Done |
| 4 | Home Page | Done |
| 5 | About Page | Done |
| 6 | Services | Done |
| 7 | Careers & Jobs | Done |
| 8 | Internships | Done |
| 9 | Projects | Done |
| 10 | Portfolio & Case Studies | Done |
| 11 | Blog | Done |
| 12 | Contact & Forms | Done |
| 13 | Authentication | Foundation (login + protected route) |
| 14 | Backend & Database | Pending |
| 15 | Connect Frontend With Backend | Pending |
| 16 | Navigation Loop Testing | Pending |
| 17 | Final QA & Optimization | Pending |

## Tech stack (frontend)

- React + TypeScript + Vite
- React Router
- Material UI
- Redux Toolkit
- Axios
- React Hook Form + Zod

## Project structure

```text
QUANTUM/
├── client/                 # Frontend application
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── contexts/
│       ├── store/
│       ├── types/
│       ├── utils/
│       ├── validations/
│       ├── constants/
│       ├── data/
│       └── theme/
├── docs/                   # Reserved for documentation
└── QUANTUM_DIGITAL_LABS_WEBSITE_SPEC.md
```

## Getting started

```bash
cd client
npm install
npm run dev
```

Or from the repository root:

```bash
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Environment variables

Copy `client/.env.example` to `client/.env` and fill values.

Never commit secrets, API keys, JWT secrets, or database credentials.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Typecheck and production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Spec

Full product specification: `QUANTUM_DIGITAL_LABS_WEBSITE_SPEC.md`
