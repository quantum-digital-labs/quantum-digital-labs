# Quantum Digital Labs Pvt. Ltd.
## Complete Project Documentation

**Version:** 0.1.0  
**Last updated:** September 2026  
**Repository:** `quantum-digital-labs` (monorepo)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Company & Product Overview](#2-company--product-overview)
3. [Business Objectives](#3-business-objectives)
4. [Target Audience](#4-target-audience)
5. [Project Status & Roadmap](#5-project-status--roadmap)
6. [System Architecture](#6-system-architecture)
7. [Technology Stack](#7-technology-stack)
8. [Repository Structure](#8-repository-structure)
9. [Website Features & Pages](#9-website-features--pages)
10. [Routing & Navigation](#10-routing--navigation)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Backend Architecture](#12-backend-architecture)
13. [REST API Reference](#13-rest-api-reference)
14. [Database Models](#14-database-models)
15. [Authentication & Authorization](#15-authentication--authorization)
16. [Forms & Submissions](#16-forms--submissions)
17. [Security](#17-security)
18. [Environment Configuration](#18-environment-configuration)
19. [Getting Started](#19-getting-started)
20. [Development Workflow](#20-development-workflow)
21. [Testing](#21-testing)
22. [Deployment Guide](#22-deployment-guide)
23. [Presentation Guide](#23-presentation-guide)
24. [Appendix](#24-appendix)

---

## 1. Executive Summary

**Quantum Digital Labs Pvt. Ltd.** is a corporate web platform built to represent a technology services company offering IT solutions, staffing, training, internships, project development, and digital marketing.

The project is a **full-stack monorepo** with:

| Layer | Status | Summary |
|-------|--------|---------|
| **Frontend** | Largely complete (Parts 1–12) | React SPA with 20+ pages, Material UI design system, form validation, and client-side routing |
| **Backend API** | Foundation complete | Express REST API with MongoDB, JWT auth, file uploads, rate limiting, and security hardening |
| **Integration** | Partial | Frontend API clients wired; content still served from static data files |
| **Admin panel** | Not started | Planned in original spec |
| **Production QA** | Pending | Navigation loop testing and final optimization remain |

**Tagline:** *Connect · Innovate · Transform*

---

## 2. Company & Product Overview

| Field | Value |
|-------|-------|
| Legal name | Quantum Digital Labs Pvt. Ltd. |
| Brand name | QUANTUM |
| Founded | May 2026 |
| Platform type | Corporate website + lead generation + recruitment portal |

### What the platform does

The website serves as a **digital front door** for Quantum Digital Labs, enabling:

- **Business clients** to explore services, request quotes, and book project demos
- **Job seekers** to browse openings and submit applications with resumes
- **Students** to discover and apply for internship programs
- **Visitors** to read blog content, view portfolio case studies, and contact the company
- **Registered users** to sign in and access the full site experience

### Design principles

- Modern, professional, trustworthy corporate aesthetic
- Mobile-first responsive layout
- Accessible navigation with no dead links
- Modular, maintainable codebase
- Security-first API design

---

## 3. Business Objectives

The platform supports fifteen core business goals:

1. Generate business leads (contact, quote, demo forms)
2. Recruit candidates (jobs listing + apply flow)
3. Attract corporate clients (services, portfolio, case studies)
4. Provide internship opportunities
5. Promote training programs
6. Showcase technology projects
7. Promote IT services
8. Promote non-IT services
9. Deliver digital marketing service pages
10. Accept hiring requirements from companies
11. Enable candidate job search and application
12. Enable student internship applications
13. Showcase technologies and expertise
14. Build company credibility (about, portfolio, blog)
15. Publish blogs and company updates

---

## 4. Target Audience

| Segment | Examples |
|---------|----------|
| **Business clients** | Startups, SMBs, MNCs, product and service companies |
| **Job seekers** | Freshers, experienced professionals, career switchers |
| **Students** | Engineering, degree, and diploma students; final-year and recent graduates |
| **Educational institutions** | Colleges, universities, training institutes, placement cells |

---

## 5. Project Status & Roadmap

### Build phases (from project spec)

| Part | Scope | Status |
|------|-------|--------|
| 1 | Project Setup | ✅ Done |
| 2 | Routing Architecture | ✅ Done |
| 3 | Header & Footer | ✅ Done |
| 4 | Home Page | ✅ Done |
| 5 | About Page | ✅ Done |
| 6 | Services | ✅ Done |
| 7 | Careers & Jobs | ✅ Done |
| 8 | Internships | ✅ Done |
| 9 | Projects | ✅ Done |
| 10 | Portfolio & Case Studies | ✅ Done |
| 11 | Blog | ✅ Done |
| 12 | Contact & Forms | ✅ Done |
| 13 | Authentication | 🟡 Foundation (login, register, protected routes) |
| 14 | Backend & Database | 🟡 Foundation (API + MongoDB models; no CMS yet) |
| 15 | Connect Frontend With Backend | 🟡 Forms + auth connected; content still static |
| 16 | Navigation Loop Testing | ⏳ Pending |
| 17 | Final QA & Optimization | ⏳ Pending |

### What is working today

- Full frontend UI across all major sections
- User registration and login against live API
- Form submissions (contact, quote, demo, job apply, internship apply) persist to MongoDB
- Resume upload (PDF/DOC/DOCX, max 5 MB)
- Reference numbers generated for every submission
- Security test suite on the API
- Rule-based chatbot assistant widget

### What is not yet built

- Admin dashboard for managing content and submissions
- Dynamic content from database (jobs, blog, services still in static TypeScript files)
- Email notifications on form submission
- Cloud file storage (Cloudinary / S3 / Azure)
- Public (unauthenticated) browsing — **currently all main pages require login**
- SEO metadata management, sitemap, analytics integration
- Chart.js / Three.js / Framer Motion enhancements from original spec

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (User)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              React SPA (Vite + TypeScript)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │  Pages   │  │Components│  │  Redux   │  │  Static Data    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services Layer (axios apiClient, authApi, formsApi)     │   │
│  └────────────────────────────┬─────────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────────┘
                                │ REST / JSON + multipart
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│           Express API (Node.js + TypeScript)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │  Routes  │  │Middleware│  │  Zod     │  │  Multer uploads │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                             │
│   Users · JobApplications · InternshipApplications            │
│   ContactMessages · QuoteRequests · DemoRequests               │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Local uploads/ directory (resumes)                 │
│         (designed for future cloud storage abstraction)         │
└─────────────────────────────────────────────────────────────────┘
```

### Request flow (example: job application)

1. User fills job application form on `/jobs/:jobId/apply`
2. React Hook Form validates with Zod schema client-side
3. `formsApi.submitJobApplication()` builds `FormData` with resume file
4. Axios sends `POST /api/applications/jobs` with Bearer token
5. Server validates with Zod, sanitizes inputs, stores file via Multer
6. MongoDB document created with reference number (e.g. `JOB-20260901-XXXX`)
7. Success panel shows reference number to the user

---

## 7. Technology Stack

### Frontend (`client/`)

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| TypeScript 6 | Type safety |
| Vite 8 | Dev server and build tool |
| React Router 7 | Client-side routing |
| Material UI 9 | Component library and theming |
| Redux Toolkit | Global auth state |
| Axios | HTTP client |
| React Hook Form | Form state management |
| Zod | Schema validation |

### Backend (`server/`)

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | HTTP server |
| TypeScript 5.9 | Type safety |
| MongoDB + Mongoose 8 | Database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Multer | File upload handling |
| Helmet | Security headers |
| express-rate-limit | Abuse prevention |
| CORS | Cross-origin control |
| Vitest + Supertest | API testing |

### Tooling

- ESLint + Prettier (client)
- tsx (server hot reload)
- dotenv (environment variables)

---

## 8. Repository Structure

```
QUANTUM/
├── client/                         # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Images and static assets
│   │   ├── components/
│   │   │   ├── about/              # About page sections
│   │   │   ├── auth/               # AuthBootstrap, ProtectedRoute, GuestRoute
│   │   │   ├── cards/              # ServiceCard, ContentCard
│   │   │   ├── chat/               # ChatbotWidget
│   │   │   ├── common/             # Shared UI (dialogs, CTAs, breadcrumbs)
│   │   │   ├── home/               # Homepage sections
│   │   │   └── layout/             # Header, Footer
│   │   ├── constants/              # Routes, company info, nav items
│   │   ├── contexts/               # AppConfigContext
│   │   ├── data/                   # Static content (jobs, services, blog…)
│   │   ├── hooks/                  # useStore, useValidationPopup
│   │   ├── layouts/                # MainLayout shell
│   │   ├── pages/                  # Route-level page components
│   │   ├── routes/                 # AppRouter
│   │   ├── services/               # apiClient, authApi, formsApi
│   │   ├── store/                  # Redux store + authSlice
│   │   ├── theme/                  # MUI theme (palette, typography, surfaces)
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── utils/                  # authStorage, chatAssistant, slugify
│   │   ├── validations/            # Zod schemas for all forms
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── server/                         # Backend Express API
│   ├── src/
│   │   ├── config/                 # env.ts, db.ts
│   │   ├── middleware/             # errorHandler.ts
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # auth, applications, inquiries
│   │   ├── utils/                  # sanitize, reference
│   │   ├── app.ts                  # Express app factory
│   │   └── index.ts                # Server entry point
│   ├── tests/                      # security.test.ts
│   ├── uploads/                    # Resume storage (runtime)
│   ├── .env.example
│   └── package.json
│
├── docs/                           # Project documentation
├── QUANTUM_DIGITAL_LABS_WEBSITE_SPEC.md   # Full product specification
├── README.md
└── package.json                    # Root scripts (dev, build, test)
```

---

## 9. Website Features & Pages

### 9.1 Home (`/`)

- Full-viewport hero with company tagline and CTAs
- Capabilities overview cards
- “Why Quantum” value proposition section
- Process/methodology timeline with progress rings
- Preview cards for jobs, internships, portfolio, and blog
- Call-to-action sections linking to services and contact

### 9.2 About (`/about`)

- Company story and mission
- Core values section
- Technology capabilities pyramid visualization
- Team and credibility content

### 9.3 Services (`/services`)

Five service categories with detailed sub-service pages:

| Category | Route | Services (approx.) |
|----------|-------|-------------------|
| IT Services | `/services/it` | Web, mobile, software, cloud, AI/ML, DevOps, etc. |
| Non-IT Services | `/services/non-it` | BPO, data entry, virtual assistance, etc. |
| Digital Marketing | `/services/digital-marketing` | SEO, social media, content, PPC, etc. |
| Staffing & Recruitment | `/services/staffing` | Permanent, contract, bulk hiring, etc. |
| Training | `/services/training` | Technical and soft-skills programs |

Each service detail page includes: description, benefits, features, technologies, process steps, deliverables, and FAQs.

### 9.4 Careers / Jobs (`/jobs`)

- Job listings grid (5 sample positions in static data)
- Job detail pages (`/jobs/:jobId`)
- Application form with resume upload (`/jobs/:jobId/apply`)

### 9.5 Internships (`/internships`)

- Internship program listings (12 programs in static data)
- Detail pages with domain, duration, mode, skills, and curriculum
- Application form with resume upload (`/internships/:internshipId/apply`)

### 9.6 Projects (`/projects`)

- Showcase of internal/demo projects (6 items)
- Project detail pages
- Request demo form (`/request-demo`)

### 9.7 Portfolio (`/portfolio`)

- Client work showcase (6 case studies)
- Portfolio detail and full case study pages

### 9.8 Blog (`/blog`)

- Article listing with category filters
- Category pages (`/blog/category/:category`)
- Article detail pages (`/blog/:slug`) — 10 sample articles

### 9.9 Contact & Lead Generation

| Page | Route | Purpose |
|------|-------|---------|
| Contact | `/contact` | General inquiries |
| Get a Quote | `/quote` | Service pricing requests |
| Request Demo | `/request-demo` | Project demo scheduling |

### 9.10 Authentication

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | Sign in (guest-only route) |
| Register | `/register` | Create account (guest-only route) |

### 9.11 System Pages

| Page | Route |
|------|-------|
| Privacy Policy | `/privacy` |
| Terms & Conditions | `/terms` |
| 404 Not Found | `*` |

### 9.12 Global UI Features

- **Header:** Responsive navigation, mobile drawer, auth actions
- **Footer:** Company, services, resources, and legal links
- **Chatbot widget:** Rule-based assistant with page suggestions
- **Breadcrumbs:** Contextual navigation on inner pages
- **Validation dialogs:** User-friendly form error popups
- **Success panels:** Reference number display after submissions
- **Scroll-to-top:** On route change

---

## 10. Routing & Navigation

All routes are defined centrally in `client/src/constants/routes.ts`. Navigation items never use `#` or empty hrefs.

### Primary header navigation

```
Home → About → Services → Careers → Internships → Projects → Portfolio → Blog → Contact
```

### Route map

| Path | Page | Auth required |
|------|------|---------------|
| `/` | Home | Yes |
| `/about` | About | Yes |
| `/services` | Services index | Yes |
| `/services/:categoryId` | Service category | Yes |
| `/services/:categoryId/:serviceSlug` | Service detail | Yes |
| `/jobs` | Jobs listing | Yes |
| `/jobs/:jobId` | Job detail | Yes |
| `/jobs/:jobId/apply` | Job application | Yes |
| `/internships` | Internships listing | Yes |
| `/internships/:internshipId` | Internship detail | Yes |
| `/internships/:internshipId/apply` | Internship application | Yes |
| `/projects` | Projects listing | Yes |
| `/projects/:projectId` | Project detail | Yes |
| `/request-demo` | Demo request form | Yes |
| `/portfolio` | Portfolio listing | Yes |
| `/portfolio/:projectId` | Portfolio detail | Yes |
| `/portfolio/:projectId/case-study` | Case study | Yes |
| `/blog` | Blog listing | Yes |
| `/blog/category/:category` | Blog category | Yes |
| `/blog/:slug` | Blog article | Yes |
| `/contact` | Contact form | Yes |
| `/quote` | Quote form | Yes |
| `/login` | Login | No (redirects if authenticated) |
| `/register` | Register | No (redirects if authenticated) |
| `/privacy` | Privacy policy | No |
| `/terms` | Terms | No |

> **Note:** Requiring authentication for all public marketing pages is a development-stage decision. For production launch, most routes should be public with auth only on apply/dashboard flows.

---

## 11. Frontend Architecture

### State management

| State type | Solution |
|------------|----------|
| Auth (user, token) | Redux Toolkit (`authSlice`) |
| Form state | React Hook Form |
| App config | React Context (`AppConfigContext`) |
| Content | Static TypeScript modules in `src/data/` |

### Session persistence

On login/register, the JWT and user object are saved to `localStorage`:

- `accessToken` — sent as `Authorization: Bearer` header
- `qdl_auth_session` — full session JSON for Redux rehydration on page reload

### API layer

```
apiClient (axios)
├── authApi      → /auth/login, /auth/register
└── formsApi     → /applications/*, /inquiries/*
```

The axios interceptor automatically:
- Attaches JWT from localStorage
- Strips `Content-Type` for `FormData` uploads
- Normalizes error messages from API responses

### Validation

Client-side Zod schemas mirror server validation in:

- `validations/auth.ts`
- `validations/contact.ts`
- `validations/quote.ts`
- `validations/applications.ts`

### Theming

Custom Material UI theme with:
- Primary navy palette (`#0C2340`)
- Accent gold/bronze (`#B8956B`)
- Custom typography scale
- Elevated surface tokens
- Component overrides for buttons, inputs, cards

### Component organization

```
components/
├── layout/     → Shell (Header, Footer)
├── common/     → Reusable primitives
├── home/       → Homepage-specific sections
├── about/      → About page sections
├── auth/       → Route guards
├── cards/      → Content cards
└── chat/       → Chatbot
```

---

## 12. Backend Architecture

### Entry points

- `src/index.ts` — Connects to MongoDB, creates upload directory, starts HTTP server
- `src/app.ts` — Express app factory (middleware, routes, error handling)

### Middleware stack

1. Disable `X-Powered-By`
2. Helmet (security headers; CSP disabled for dev flexibility)
3. CORS (allows `CLIENT_URL` + localhost origins in development)
4. JSON body parser (100 KB limit)
5. Rate limiters:
   - Auth routes: 30 requests / 15 min
   - Submission routes: 60 requests / 15 min
6. Route handlers
7. 404 handler
8. Global error handler

### Error handling

Custom `ApiError` class returns consistent JSON:

```json
{ "message": "Human-readable error message" }
```

Zod validation errors are mapped to `400` responses. Stack traces are never exposed to clients.

---

## 13. REST API Reference

**Base URL:** `http://localhost:5050/api` (development)

### Health

```
GET /api/health
```

Response:
```json
{
  "ok": true,
  "service": "quantum-digital-labs-api",
  "database": "connected"
}
```

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass1",
  "name": "Optional Name"
}
```

Response `201`:
```json
{
  "accessToken": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "candidate" }
}
```

Password rules: minimum 8 characters, must contain at least one letter and one number.

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass1"
}
```

Response `200`: same shape as register.

Failure response `401`: `{ "message": "Invalid email or password." }` (no email enumeration).

### Applications

#### Job application
```
POST /api/applications/jobs
Content-Type: multipart/form-data

Fields:
  jobId, fullName, email, phone, location, education,
  experience, skills, linkedin (optional), portfolio (optional),
  coverLetter, resume (file: PDF/DOC/DOCX, max 5MB)
```

Response `201`:
```json
{ "referenceNumber": "JOB-20260901-AB12", "id": "..." }
```

#### Internship application
```
POST /api/applications/internships
Content-Type: multipart/form-data

Fields:
  internshipId, fullName, email, phone, college, course,
  year, skills, message, resume (file)
```

Response `201`:
```json
{ "referenceNumber": "INT-20260901-CD34", "id": "..." }
```

### Inquiries

#### Contact
```
POST /api/inquiries/contact
{
  "name", "email", "phone", "company" (optional),
  "service", "message"
}
```

#### Quote request
```
POST /api/inquiries/quote
{
  "name", "email", "phone", "company", "service",
  "budget" (optional), "requirements", "timeline" (optional)
}
```

#### Demo request
```
POST /api/inquiries/demo
{
  "name", "email", "phone", "company", "project",
  "requirements", "preferredDate", "message" (optional)
}
```

All inquiry endpoints return:
```json
{ "referenceNumber": "CNT|QTE|DMO-...", "id": "..." }
```

---

## 14. Database Models

**Database name:** `quantum_digital_labs`

### User

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, lowercase |
| passwordHash | String | bcrypt hashed |
| role | Enum | `candidate`, `admin`, `editor` (default: candidate) |
| isActive | Boolean | Default true |
| timestamps | Auto | createdAt, updatedAt |

### JobApplication

| Field | Type |
|-------|------|
| referenceNumber | String (unique) |
| jobId | String (indexed) |
| fullName, email, phone, location | String |
| education, experience, skills | String |
| linkedin, portfolio | String (optional) |
| coverLetter | String |
| resumeFileName, resumePath | String |
| status | Enum: received → reviewing → shortlisted → rejected → hired |

### InternshipApplication

Similar to JobApplication with college, course, year, message instead of job-specific fields.

### ContactMessage, QuoteRequest, DemoRequest

Store sanitized form fields plus auto-generated `referenceNumber` and timestamps.

### Reference number format

```
{PREFIX}-{YYYYMMDD}-{RANDOM4}
```

Prefixes: `JOB`, `INT`, `CNT`, `QTE`, `DMO`

---

## 15. Authentication & Authorization

### Flow

```
┌──────────┐    register/login     ┌──────────┐
│  Client  │ ───────────────────►  │   API    │
└──────────┘                       └──────────┘
     │                                   │
     │  JWT (7-day expiry)               │ bcrypt verify
     │  + user object                    │ MongoDB User
     ▼                                   ▼
 localStorage                     passwordHash stored
     │
     ▼
 Redux authSlice (isAuthenticated = true)
     │
     ▼
 ProtectedRoute allows access
```

### Route guards

- **`ProtectedRoute`** — Redirects unauthenticated users to `/login`, preserving intended URL in location state
- **`GuestRoute`** — Redirects authenticated users away from login/register

### Roles

| Role | Current usage |
|------|---------------|
| `candidate` | Default on registration |
| `admin` | Reserved for future admin panel |
| `editor` | Reserved for content management |

Role mass-assignment on register is blocked (`.strict()` Zod schemas).

---

## 16. Forms & Submissions

All forms use **React Hook Form + Zod** on the client and **Zod + sanitize utilities** on the server.

| Form | Client validation | API endpoint | File upload |
|------|-------------------|--------------|-------------|
| Contact | `contact.ts` | `POST /inquiries/contact` | No |
| Quote | `quote.ts` | `POST /inquiries/quote` | No |
| Demo | `applications.ts` | `POST /inquiries/demo` | No |
| Job apply | `applications.ts` | `POST /applications/jobs` | Resume required |
| Internship apply | `applications.ts` | `POST /applications/internships` | Resume required |
| Login | `auth.ts` | `POST /auth/login` | No |
| Register | `auth.ts` | `POST /auth/register` | No |

On success, a **SuccessPanel** displays the reference number for the user's records.

---

## 17. Security

### Implemented measures

| Area | Implementation |
|------|----------------|
| Password storage | bcrypt (cost factor 10) |
| Authentication | JWT with configurable secret |
| Input validation | Zod strict schemas on all endpoints |
| XSS prevention | HTML tag stripping in sanitize utilities |
| NoSQL injection | Email sanitization rejects operator objects |
| File uploads | Extension whitelist, 5 MB limit, filename sanitization |
| Rate limiting | Separate limits for auth and submissions |
| HTTP headers | Helmet (nosniff, frame options, etc.) |
| CORS | Origin allowlist |
| Body size | 100 KB JSON limit |
| Error responses | No stack traces or password hashes leaked |
| Login failures | Single generic message (anti-enumeration) |

### Security test coverage

`server/tests/security.test.ts` validates:

- Health endpoint behavior
- Helmet headers
- Registration and login flows
- Weak password rejection
- Role mass-assignment blocking
- XSS sanitization on contact messages
- Oversized body rejection
- Malicious file extension rejection
- Valid PDF upload acceptance
- Filename traversal sanitization
- CORS policy

Run tests:
```bash
npm run test:server
```

---

## 18. Environment Configuration

### Client (`client/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | Quantum Digital Labs | Display name |
| `VITE_API_BASE_URL` | `http://localhost:5050/api` | Backend API base URL |

### Server (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5050` | API server port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/quantum_digital_labs` | MongoDB connection |
| `JWT_SECRET` | dev fallback | **Must be 32+ chars in production** |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | `development` | Environment mode |

Copy example files before first run:
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

**Never commit `.env` files or secrets to version control.**

---

## 19. Getting Started

### Prerequisites

- **Node.js** 20+ recommended
- **npm** 10+
- **MongoDB** 6+ running locally (or MongoDB Atlas URI)

### Installation

```bash
# Clone / open the repository
cd QUANTUM

# Install frontend dependencies
cd client && npm install && cd ..

# Install backend dependencies
cd server && npm install && cd ..
```

### Running locally

**Terminal 1 — Frontend:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
npm run dev:server
# API at http://localhost:5050/api
```

**Terminal 3 — MongoDB** (if not running as a service):
```bash
mongod
```

### First-time user flow

1. Open `http://localhost:5173`
2. You will be redirected to `/login` (auth gate)
3. Click Register, create an account
4. After login, full site navigation is available
5. Submit a contact form or job application to verify API connectivity

---

## 20. Development Workflow

### Root scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start frontend dev server |
| `npm run dev:server` | Start backend with hot reload |
| `npm run build` | Production frontend build |
| `npm run build:server` | Compile server TypeScript |
| `npm run lint` | ESLint on client |
| `npm run test:server` | Run API security tests |
| `npm run preview` | Preview production frontend build |

### Adding a new page

1. Create page component in `client/src/pages/`
2. Add route constant to `constants/routes.ts`
3. Register route in `routes/AppRouter.tsx`
4. Add nav link to `HEADER_NAV` or relevant footer array if needed

### Adding a new API endpoint

1. Create/update Mongoose model in `server/src/models/`
2. Add route handler in `server/src/routes/`
3. Register router in `server/src/app.ts`
4. Add Zod validation and sanitization
5. Create client service function in `client/src/services/`
6. Add test cases in `server/tests/`

### Code conventions

- Use canonical `ROUTES` constants — never hardcode paths
- Match existing MUI + theme patterns
- Client and server validation schemas should align
- Sanitize all user text before database storage

---

## 21. Testing

### Backend (automated)

```bash
cd server
npm test
```

Uses Vitest + Supertest against a test database (`quantum_digital_labs_test`).

### Frontend

No automated test suite yet. Manual testing checklist:

- [ ] Register and login flow
- [ ] Session persists on page reload
- [ ] All header/footer links resolve (no 404)
- [ ] Contact form submits and shows reference number
- [ ] Quote form submits
- [ ] Demo request submits
- [ ] Job application with PDF resume
- [ ] Internship application with PDF resume
- [ ] Chatbot responds with relevant suggestions
- [ ] Mobile responsive layout on all pages
- [ ] Logout clears session

---

## 22. Deployment Guide

### Frontend

```bash
cd client
npm run build
# Output: client/dist/
```

Serve `dist/` with any static host (Vercel, Netlify, Nginx, CloudFront).

Set `VITE_API_BASE_URL` to production API URL at build time.

### Backend

```bash
cd server
npm run build
npm start
# Runs dist/index.js
```

Production checklist:

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Set `CLIENT_URL` to production frontend origin
- [ ] Configure reverse proxy (Nginx) with HTTPS
- [ ] Move uploads to cloud storage
- [ ] Set up process manager (PM2, systemd)
- [ ] Enable MongoDB backups
- [ ] Configure logging and monitoring

### Recommended production architecture

```
Users → CDN (static SPA) → API server (HTTPS) → MongoDB Atlas
                              ↓
                         Cloud storage (resumes)
```

---

## 23. Presentation Guide

Use this section when demoing or pitching the project.

### Elevator pitch (30 seconds)

> Quantum Digital Labs is a full-stack corporate platform that connects businesses with technology services, talent, and training. Built with React and Node.js, it features a modern responsive website, secure user authentication, and real-time form processing for job applications, internship enrollments, and business inquiries — all backed by MongoDB with enterprise-grade security.

### Demo script (5 minutes)

1. **Show login/register** — Explain JWT auth and session persistence
2. **Home page** — Hero, capabilities, why-us, process methodology
3. **Services** — Navigate IT → Website Development detail page
4. **Careers** — Open a job → apply with resume upload → show reference number
5. **Internships** — Browse programs, show application flow
6. **Portfolio & Blog** — Content marketing capabilities
7. **Contact / Quote** — Lead generation forms
8. **Chatbot** — Ask “What services do you offer?”
9. **Backend** — Show MongoDB document or hit `/api/health`
10. **Security** — Mention rate limiting, bcrypt, sanitization, test suite

### Key differentiators to highlight

| Point | Detail |
|-------|--------|
| **Full-stack** | Not just a static site — real API and database |
| **Security-first** | 20+ automated security tests, OWASP-aware patterns |
| **Modular architecture** | Easy to extend with admin panel and CMS |
| **Type-safe** | TypeScript end-to-end with shared validation patterns |
| **Production-ready forms** | Reference numbers, file uploads, rate limiting |
| **Scalable design** | Static content → API-driven content migration path clear |

### Honest current limitations (for Q&A)

- Marketing pages require login (should be opened up for launch)
- Content is static TypeScript data, not CMS-managed yet
- No email notifications on submissions
- No admin dashboard
- Resume files stored locally, not in cloud yet

### Future roadmap talking points

1. Public browsing without mandatory login
2. Admin dashboard for submissions and content
3. Email/SMS notifications
4. Cloud file storage integration
5. SEO optimization and analytics
6. Dynamic job/blog CMS
7. Role-based admin and editor access

---

## 24. Appendix

### A. Static content inventory

| Data file | Content |
|-----------|---------|
| `services.ts` | 5 categories, ~40 service offerings |
| `jobs.ts` | 5 job listings |
| `internships.ts` | 12 internship programs |
| `projects.ts` | 6 demo projects |
| `portfolio.ts` | 6 portfolio case studies |
| `blog.ts` | 10 blog articles |
| `homeCapabilities.ts` | 7 capability cards |
| `whyQuantum.ts` | 7 value propositions |
| `processMethod.ts` | 7-phase delivery methodology |

### B. User roles

```typescript
type UserRole = 'candidate' | 'admin' | 'editor';
```

### C. Service category IDs

```typescript
type ServiceCategoryId =
  | 'it'
  | 'non-it'
  | 'digital-marketing'
  | 'staffing'
  | 'training';
```

### D. Related documents

| Document | Location |
|----------|----------|
| Quick start README | `/README.md` |
| Full product specification | `/QUANTUM_DIGITAL_LABS_WEBSITE_SPEC.md` |
| Client env template | `/client/.env.example` |
| Server env template | `/server/.env.example` |

### E. Contact placeholders

The following company fields use placeholders until official data is provided:

- Email: `[COMPANY EMAIL]`
- Phone: `[COMPANY PHONE]`
- Address: `[OFFICE ADDRESS]`

Update in `client/src/constants/company.ts`.

---

*Documentation generated from codebase analysis. For the authoritative product requirements, refer to `QUANTUM_DIGITAL_LABS_WEBSITE_SPEC.md`.*
