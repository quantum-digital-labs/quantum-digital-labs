# QUANTUM DIGITAL LABS PVT. LTD.

## Complete Website Development Specification & Cursor Build Prompt

---

# 1. PROJECT OVERVIEW

Build a modern, professional, responsive, scalable corporate website for:

**Company Name:** Quantum Digital Labs Pvt. Ltd.

The website should represent Quantum Digital Labs as a technology, recruitment, training, digital marketing, internship, and project-services company.

The website must be:

* Modern
* Professional
* Trustworthy
* Responsive
* SEO-friendly
* Fast
* Secure
* Accessible
* Scalable
* Mobile-first
* Easy to maintain
* Suitable for businesses, job seekers, colleges, students, startups, and MNCs

The entire application must be developed using a clean modular architecture.

---

# 2. MAIN BUSINESS OBJECTIVES

The website should help Quantum Digital Labs:

1. Generate business leads
2. Recruit candidates
3. Attract corporate clients
4. Provide internship opportunities
5. Provide training programs
6. Showcase projects
7. Promote IT services
8. Promote non-IT services
9. Provide digital marketing services
10. Allow companies to submit hiring requirements
11. Allow candidates to search and apply for jobs
12. Allow students to apply for internships
13. Showcase technologies and expertise
14. Build company credibility
15. Publish blogs and company updates

---

# 3. TARGET AUDIENCE

The website should serve the following audiences:

### Business Clients

* Startups
* Small businesses
* Medium businesses
* MNCs
* Corporate organizations
* Product companies
* Service companies

### Job Seekers

* Freshers
* Experienced professionals
* Graduates
* Career switchers

### Students

* Engineering students
* Degree students
* Diploma students
* Final-year students
* Recent graduates

### Educational Institutions

* Colleges
* Universities
* Training institutes
* Placement cells

---

# 4. WEBSITE TECHNOLOGY STACK

Use the following recommended architecture.

## Frontend

* React
* TypeScript
* Vite
* React Router
* Material UI
* Tailwind CSS where useful
* Axios
* Redux Toolkit where global state is required
* React Hook Form
* Zod validation
* Chart.js
* Three.js for selected visual sections
* Framer Motion for animations

## Backend

Use:

* Node.js
* Express.js
* TypeScript
* REST API architecture
* JWT authentication
* bcrypt/password hashing
* Helmet
* CORS
* Rate limiting
* Input validation

## Database

Use:

* MongoDB
* Mongoose

## File Storage

Design the application so uploaded:

* Resumes
* Profile photos
* Project images
* Certificates
* Company documents

can be stored securely.

Storage should be abstracted so it can later support:

* Cloudinary
* AWS S3
* Azure Blob Storage

---

# 5. PROJECT STRUCTURE

Create a monorepo structure:

```text
quantum-digital-labs/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── sections/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── routes/
│   │   ├── theme/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── types/
│   │   └── server.ts
│   │
│   └── package.json
│
├── admin/
│
├── docs/
│
├── .env.example
├── README.md
└── package.json
```

---

# 6. WEBSITE NAVIGATION

Create the main navigation:

```text
Home
About Us
Services
    IT Services
    Non-IT Services
    Digital Marketing
    Staffing & Recruitment
Internships
Training & Programs
Jobs
Projects
Case Studies
Success Stories
Blog
Contact Us
```

Primary CTA buttons:

```text
Hire Talent
Find Jobs
Apply for Internship
Get a Quote
Contact Us
```

---

# 7. HOME PAGE

Create a highly professional homepage.

## Hero Section

Headline:

> Transforming Ideas Into Digital Solutions

Supporting text:

> Quantum Digital Labs Pvt. Ltd. delivers technology solutions, staffing, training, internships, digital marketing, and project development services for businesses and emerging talent.

CTA buttons:

```text
Explore Services
Talk to Us
```

Hero should contain:

* Modern technology visual
* Animated background
* Abstract quantum/digital elements
* Subtle particle effects
* Professional corporate design

Do not overload the hero with animations.

---

# 8. HOME PAGE SECTIONS

Build the homepage using the following sections:

### Section 1

Hero

### Section 2

Trust/Statistics

Example:

```text
100+ Candidates Placed
50+ Projects
25+ Technology Skills
20+ Corporate Clients
```

Do not hardcode fake statistics in production.

Make statistics configurable from the backend/admin panel.

### Section 3

What We Do

Cards:

* IT Services
* Non-IT Services
* Staffing & Recruitment
* Digital Marketing
* Training
* Internships
* Project Development

### Section 4

Why Quantum Digital Labs

Show:

* Industry Expertise
* Skilled Professionals
* Customized Solutions
* Career Opportunities
* Practical Learning
* Business-Focused Solutions

### Section 5

IT Services

### Section 6

Non-IT Services

### Section 7

Staffing & Recruitment

### Section 8

Internship Programs

### Section 9

Training Programs

### Section 10

Digital Marketing

### Section 11

Featured Projects

### Section 12

Case Studies

### Section 13

Testimonials

### Section 14

Technology Stack

### Section 15

Call To Action

Example:

> Let's Build Something Better Together.

Buttons:

```text
Start a Project
Hire Talent
```

### Section 16

Latest Blog Posts

### Section 17

Footer

---

# 9. ABOUT US PAGE

Create:

```text
/about
```

Sections:

* Company Introduction
* Vision
* Mission
* Core Values
* What We Do
* Our Approach
* Leadership
* Team
* Technologies
* Why Choose Us
* CTA

---

# 10. VISION

Use editable content.

Suggested default:

> To become a trusted digital and talent solutions partner by creating innovative technology solutions, developing skilled professionals, and enabling organizations to grow through technology and people.

---

# 11. MISSION

Suggested default:

> Our mission is to deliver reliable technology, staffing, training, digital marketing, and project solutions while creating meaningful career and learning opportunities for students and professionals.

Make this editable from the admin panel.

---

# 12. IT SERVICES

Create:

```text
/services/it
```

Services:

### Website Development

* Corporate websites
* Business websites
* E-commerce
* Web applications
* Custom portals

### Mobile App Development

* Android
* iOS
* Cross-platform applications

### Software Development

* Enterprise applications
* CRM
* ERP
* Custom software

### UI/UX Design

* User research
* Wireframes
* Prototypes
* Design systems

### Cloud Services

* Cloud migration
* Cloud deployment
* Infrastructure support
* Cloud optimization

### AI & Automation

* AI integration
* Workflow automation
* Machine learning
* Intelligent applications

### Maintenance & Support

* Bug fixing
* Performance optimization
* Security updates
* Technical support

---

# 13. NON-IT SERVICES

Create:

```text
/services/non-it
```

Include:

* BPO
* Voice Process
* Non-Voice Process
* Customer Support
* Back Office
* Data Entry
* Operations Support
* Recruitment Support
* Administrative Support
* Content Review
* Content Moderation
* Medical Coding
* Medical Billing
* Mapping

Create individual service cards.

---

# 14. DIGITAL MARKETING

Create:

```text
/services/digital-marketing
```

Include:

* SEO
* Google Ads
* Social Media Marketing
* Content Marketing
* Email Marketing
* Branding
* Social Media Ads
* Website Development
* Video Editing
* Graphic Design
* Real Estate Marketing
* Lead Generation

Each service should have:

```text
Title
Description
Benefits
Process
Technologies/Tools
CTA
```

---

# 15. STAFFING & RECRUITMENT

Create:

```text
/services/staffing
```

Include:

* IT Recruitment
* Non-IT Recruitment
* Contract Staffing
* Permanent Staffing
* Bulk Hiring
* Executive Search
* Recruitment Process Outsourcing

Recruitment workflow:

```text
Requirement Collection
        ↓
Candidate Sourcing
        ↓
Screening
        ↓
Technical/HR Evaluation
        ↓
Shortlisting
        ↓
Interview Coordination
        ↓
Selection
        ↓
Onboarding
```

Create a:

```text
Hire Talent
```

CTA.

---

# 16. JOBS PAGE

Create:

```text
/jobs
```

Features:

* Search jobs
* Filter jobs
* Job category
* Location
* Experience
* Employment type
* Remote/hybrid/on-site
* Posted date
* Job details
* Apply button

Example:

```text
Job Title
Company
Location
Experience
Employment Type
Skills
Description
Responsibilities
Requirements
Benefits
Apply Now
```

---

# 17. JOB APPLICATION

Create:

```text
/jobs/:jobId/apply
```

Application form:

```text
Full Name
Email
Phone
Location
Qualification
Experience
Skills
Resume Upload
LinkedIn
Portfolio
Cover Letter
Consent
Submit Application
```

Backend must validate all fields.

Resume uploads must be restricted by:

* File type
* File size
* Filename sanitization

---

# 18. CANDIDATE REGISTRATION

Create:

```text
/register
```

Candidate fields:

```text
Name
Email
Phone
Password
Qualification
Skills
Experience
Location
Resume
```

Implement secure authentication.

---

# 19. LOGIN

Create:

```text
/login
```

Support:

```text
Candidate Login
Admin Login
```

Do not expose admin functionality to normal users.

---

# 20. AUTHENTICATION

Use JWT authentication.

Implement:

```text
Access Token
Refresh Token
Password Hashing
Role-Based Access Control
Protected Routes
Session Management
Logout
```

Roles:

```text
admin
hr
recruiter
editor
candidate
client
```

Never store passwords as plain text.

---

# 21. INTERNSHIPS

Create:

```text
/internships
```

Programs should include:

* Full Stack Development
* Python
* Java
* Data Science
* AI/ML
* Web Development
* Mobile Development
* UI/UX
* Digital Marketing
* Cloud Computing
* Testing
* IoT

Each internship should display:

```text
Domain
Duration
Eligibility
Skills
Certificate
Live Project
Mentorship
Mode
Benefits
Fee
Available Seats
Application Deadline
```

---

# 22. INTERNSHIP APPLICATION

Create:

```text
/internships/:internshipId/apply
```

Fields:

```text
Name
Email
Phone
College
Course
Year
Branch
Skills
Resume
Preferred Domain
Message
```

Store applications in MongoDB.

---

# 23. TRAINING & PROGRAMS

Create:

```text
/training
```

Training categories:

* Full Stack Development
* Python
* Java
* SQL
* Data Analytics
* AI/ML
* Cloud
* Digital Marketing
* Software Testing
* UI/UX

Each program should contain:

```text
Program Name
Description
Curriculum
Duration
Mode
Eligibility
Projects
Certificate
Mentor
Price
FAQ
Register Now
```

---

# 24. TRAINING REGISTRATION

Create registration form:

```text
Name
Email
Phone
College/Organization
Program
Preferred Mode
Message
```

Store registrations in database.

---

# 25. PROJECTS PAGE

Create:

```text
/projects
```

Show project cards containing:

```text
Project Image
Project Name
Category
Technologies
Short Description
Client/Industry
View Details
```

Categories:

```text
Web
Mobile
AI
ML
Cloud
IoT
Automation
Digital Marketing
```

---

# 26. PROJECT DETAIL PAGE

Create:

```text
/projects/:slug
```

Include:

* Project overview
* Problem
* Solution
* Features
* Technology stack
* Development process
* Screenshots
* Results
* Case study
* CTA

---

# 27. CASE STUDIES

Create:

```text
/case-studies
```

Each case study:

```text
Client/Industry
Problem
Challenges
Solution
Technology
Implementation
Results
Lessons
Gallery
```

---

# 28. SUCCESS STORIES

Create:

```text
/success-stories
```

Include:

* Candidate success
* Client success
* Student success
* Project success

Each story should contain:

```text
Name
Role
Company
Story
Image
Result
```

---

# 29. TESTIMONIALS

Create testimonials section.

Fields:

```text
Name
Designation
Company
Photo
Rating
Review
Category
```

Categories:

```text
Client
Candidate
Student
College
```

Testimonials must be manageable from admin panel.

---

# 30. BLOG

Create:

```text
/blog
```

Features:

* Blog listing
* Search
* Categories
* Tags
* Featured blogs
* Latest posts

Categories:

```text
Technology
AI
Career
Recruitment
Digital Marketing
Training
Internships
Company News
```

---

# 31. BLOG DETAIL

Create:

```text
/blog/:slug
```

Include:

* Title
* Author
* Published date
* Featured image
* Content
* Tags
* Related articles
* Social sharing
* SEO metadata

---

# 32. CONTACT PAGE

Create:

```text
/contact
```

Fields:

```text
Name
Email
Phone
Company
Service
Message
```

CTA:

```text
Send Message
```

Also include:

```text
Email
Phone
Office Address
Business Hours
Social Media
Map
```

Do not hardcode sensitive credentials.

---

# 33. BUSINESS LEAD FORM

Create a dedicated:

```text
/get-quote
```

form.

Fields:

```text
Name
Company
Email
Phone
Service
Budget
Timeline
Project Description
Attachment
```

Save every inquiry in the database.

---

# 34. HIRING REQUEST FORM

Create:

```text
/hire-talent
```

Fields:

```text
Company Name
Contact Person
Email
Phone
Job Title
Number of Positions
Employment Type
Location
Experience
Required Skills
Salary Range
Job Description
Expected Joining Date
```

---

# 35. ADMIN DASHBOARD

Create:

```text
/admin
```

Dashboard should include:

```text
Overview
Users
Candidates
Jobs
Applications
Internships
Internship Applications
Training Programs
Training Registrations
Projects
Case Studies
Testimonials
Blogs
Leads
Contact Messages
Hiring Requests
Analytics
Settings
```

---

# 36. ADMIN DASHBOARD ANALYTICS

Show:

```text
Total Candidates
Total Jobs
Total Applications
Total Leads
Total Internships
Internship Applications
Training Registrations
Contact Requests
Hiring Requests
```

Use charts where useful.

---

# 37. ADMIN JOB MANAGEMENT

Admin must be able to:

```text
Create Job
Edit Job
Delete Job
Publish Job
Unpublish Job
Close Job
View Applications
Download Resume
Change Application Status
```

Application statuses:

```text
Applied
Screening
Shortlisted
Interview
Selected
Rejected
On Hold
Joined
```

---

# 38. ADMIN INTERNSHIP MANAGEMENT

Admin must be able to:

```text
Create Internship
Edit Internship
Delete Internship
Publish
Unpublish
View Applications
Change Status
```

---

# 39. ADMIN BLOG MANAGEMENT

Admin/editor should be able to:

```text
Create Blog
Edit Blog
Delete Blog
Draft
Publish
Schedule
Add SEO Metadata
Upload Featured Image
Add Tags
Add Categories
```

---

# 40. DATABASE MODELS

Create MongoDB models for:

```text
User
Candidate
Job
JobApplication
Internship
InternshipApplication
TrainingProgram
TrainingRegistration
Project
CaseStudy
Testimonial
Blog
Lead
ContactMessage
HiringRequest
NewsletterSubscriber
```

---

# 41. USER MODEL

Example fields:

```text
_id
name
email
phone
passwordHash
role
isActive
createdAt
updatedAt
```

Never store plaintext passwords.

---

# 42. JOB MODEL

Fields:

```text
title
slug
description
responsibilities
requirements
skills
location
experience
employmentType
salary
category
status
applicationDeadline
createdAt
updatedAt
```

---

# 43. API ARCHITECTURE

Create REST endpoints.

Example:

```text
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/refresh

/api/jobs
/api/jobs/:id
/api/jobs/:id/apply

/api/internships
/api/internships/:id
/api/internships/:id/apply

/api/training
/api/training/:id/register

/api/projects
/api/projects/:id

/api/case-studies
/api/testimonials

/api/blog
/api/blog/:slug

/api/contact
/api/leads
/api/hiring-requests
```

Admin endpoints:

```text
/api/admin/jobs
/api/admin/applications
/api/admin/candidates
/api/admin/internships
/api/admin/training
/api/admin/projects
/api/admin/blog
/api/admin/leads
/api/admin/messages
```

Protect admin routes with role-based authorization.

---

# 44. ROUTING RULES

Public routes:

```text
/
/about
/services
/services/it
/services/non-it
/services/digital-marketing
/services/staffing
/jobs
/jobs/:id
/internships
/internships/:id
/training
/projects
/projects/:slug
/case-studies
/success-stories
/blog
/blog/:slug
/contact
/get-quote
/hire-talent
```

Candidate routes:

```text
/login
/register
/profile
/my-applications
/my-internships
```

Admin routes:

```text
/admin
/admin/jobs
/admin/applications
/admin/candidates
/admin/internships
/admin/training
/admin/projects
/admin/blog
/admin/leads
/admin/settings
```

---

# 45. ROUTE PROTECTION

Implement:

```text
PublicRoute
ProtectedRoute
AdminRoute
RoleProtectedRoute
```

Examples:

```text
Candidate cannot access /admin
Admin can access admin dashboard
HR can access recruitment features
Editor can manage blogs
```

Unauthorized users should receive:

```text
401 Unauthorized
403 Forbidden
```

---

# 46. DESIGN SYSTEM

Create a professional technology-company design system.

Primary brand direction:

```text
Quantum / Digital / Technology / Innovation
```

Suggested colors:

```text
Primary: Deep Blue
Secondary: Electric Blue
Accent: Cyan
Background: White / Very Light Gray
Dark Sections: Deep Navy / Near Black
Text: Dark Gray
```

Keep colors configurable through theme variables.

---

# 47. TYPOGRAPHY

Use a modern font such as:

```text
Inter
Manrope
Poppins
```

Use consistent:

```text
H1
H2
H3
Body
Caption
Button
```

Do not use too many fonts.

---

# 48. LOGO

Use the Quantum Digital Labs logo supplied by the company.

The logo should appear in:

```text
Navbar
Footer
Login
Admin dashboard
Email templates
Favicon
```

Use the actual logo asset once provided.

---

# 49. RESPONSIVE DESIGN

The website must work correctly on:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Breakpoints should be consistent.

Test:

```text
320px
375px
425px
768px
1024px
1440px
1920px
```

---

# 50. ACCESSIBILITY

Implement:

* Semantic HTML
* Keyboard navigation
* Accessible buttons
* Proper labels
* Alt text
* Focus states
* ARIA only where required
* Good color contrast
* Form error messages

---

# 51. SEO

Every public page should support:

```text
Title
Meta Description
Canonical URL
Open Graph
Twitter/X metadata
Structured Data
Sitemap
Robots.txt
```

Use clean URLs.

Example:

```text
/services/web-development
```

instead of:

```text
/service?id=123
```

---

# 52. PERFORMANCE

Optimize:

* Images
* Lazy loading
* Code splitting
* API calls
* Bundle size
* Caching
* Fonts
* Animations

Avoid unnecessary Three.js or heavy animation on every page.

---

# 53. SECURITY

Implement:

```text
JWT authentication
Password hashing
Helmet
CORS
Rate limiting
Input validation
MongoDB query protection
File upload validation
Secure HTTP headers
Environment variables
Role-based authorization
```

Never place:

```text
API keys
JWT secrets
Database passwords
Cloud credentials
Email passwords
```

inside frontend code.

---

# 54. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

Example:

```text
PORT=
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Use placeholder values only.

---

# 55. EMAIL NOTIFICATIONS

Design an email notification system for:

### Candidate

* Registration confirmation
* Job application confirmation
* Interview notification
* Application status update

### Client

* Lead acknowledgement
* Hiring request acknowledgement
* Quote request acknowledgement

### Internship

* Application confirmation
* Selection notification

### Training

* Registration confirmation

Use a service abstraction so the email provider can be changed later.

---

# 56. CONTACT/LEAD MANAGEMENT

Every form submission should:

1. Validate request
2. Save data
3. Generate unique ID
4. Store timestamp
5. Send notification
6. Return success response

Admin should be able to:

```text
View
Search
Filter
Export
Change status
Add notes
Delete/archive
```

---

# 57. FORM UX

All forms must include:

```text
Loading state
Success state
Error state
Validation
Required fields
Clear error messages
Submit button state
```

Example:

```text
Submitting...
Submitted Successfully
Something went wrong. Please try again.
```

Never silently fail.

---

# 58. ERROR HANDLING

Frontend:

```text
404 page
500 page
API error handling
Network error handling
Form validation errors
Authentication errors
```

Backend:

```text
Central error middleware
Structured API errors
HTTP status codes
Request validation
Logging
```

---

# 59. 404 PAGE

Create a creative technology-themed 404 page.

Example:

> Looks like this quantum path doesn't exist.

Buttons:

```text
Back Home
Explore Services
```

---

# 60. LOADING EXPERIENCE

Use:

* Skeleton loaders
* Button loaders
* Page loaders
* Smooth transitions

Avoid excessive spinners.

---

# 61. FOOTER

Footer should contain:

### Company

```text
About
Vision
Mission
Careers
Contact
```

### Services

```text
IT Services
Non-IT Services
Digital Marketing
Staffing
Training
Internships
```

### Resources

```text
Jobs
Projects
Case Studies
Blog
```

### Contact

```text
Email
Phone
Location
```

### Social

```text
LinkedIn
Instagram
Facebook
YouTube
```

Add:

```text
Privacy Policy
Terms & Conditions
Cookie Policy
```

---

# 62. NEWSLETTER

Create:

```text
/newsletter
```

or an embedded footer subscription form.

Fields:

```text
Email
```

Store subscribers in MongoDB.

Prevent duplicate subscriptions.

---

# 63. SEARCH

Implement global search for:

```text
Jobs
Blogs
Projects
Services
Internships
Training
```

Use debouncing on search inputs.

---

# 64. FILTERING

Jobs:

```text
Location
Experience
Category
Employment Type
Skills
```

Internships:

```text
Domain
Duration
Mode
Eligibility
```

Blogs:

```text
Category
Tag
Date
```

Projects:

```text
Category
Technology
Industry
```

---

# 65. ADMIN CONTENT MANAGEMENT

Avoid hardcoding important company content.

Admin should be able to edit:

```text
Homepage sections
About content
Vision
Mission
Services
Jobs
Internships
Training
Projects
Testimonials
Blogs
Contact information
Statistics
```

---

# 66. ANALYTICS

Prepare the architecture for:

```text
Google Analytics
Google Search Console
Conversion tracking
Job application tracking
Lead tracking
Contact form tracking
```

Track events such as:

```text
Job Apply
Internship Apply
Quote Request
Contact Submission
Hire Talent
Newsletter Signup
```

---

# 67. COOKIE/PRIVACY

Create:

```text
Privacy Policy
Terms & Conditions
Cookie Policy
```

Add a cookie consent interface if required.

---

# 68. COMPONENT ARCHITECTURE

Create reusable components:

```text
Navbar
Footer
HeroSection
SectionHeader
ServiceCard
JobCard
InternshipCard
TrainingCard
ProjectCard
BlogCard
TestimonialCard
StatsCard
CTASection
ContactForm
JobApplicationForm
InternshipApplicationForm
SearchBar
FilterPanel
Pagination
Modal
Toast
LoadingSpinner
Skeleton
FileUpload
ProtectedRoute
```

Do not duplicate components unnecessarily.

---

# 69. API SERVICE ARCHITECTURE

Create:

```text
authService
jobService
internshipService
trainingService
projectService
blogService
leadService
contactService
adminService
```

Use Axios with a centralized API client.

---

# 70. STATE MANAGEMENT

Use Redux Toolkit only where global state is actually needed.

Potential global states:

```text
Authentication
User
Theme
Notifications
Admin state
```

Do not place every component state inside Redux.

---

# 71. BACKEND ARCHITECTURE

Use:

```text
Routes
    ↓
Controllers
    ↓
Services
    ↓
Models
    ↓
Database
```

Example:

```text
job.routes.ts
job.controller.ts
job.service.ts
job.model.ts
job.validator.ts
```

Keep business logic out of route files.

---

# 72. VALIDATION

Use a schema validation library.

Validate:

* Request body
* Query parameters
* URL parameters
* File uploads
* User registration
* Job applications
* Lead forms
* Hiring forms

Return useful validation errors.

---

# 73. FILE UPLOADS

Allowed resume formats:

```text
PDF
DOC
DOCX
```

Maximum file size should be configurable.

Validate:

```text
MIME type
Extension
File size
Filename
```

Never trust the extension alone.

---

# 74. DATABASE INDEXING

Add indexes where appropriate:

```text
User email
Job slug
Job status
Job category
Blog slug
Blog category
Application candidate ID
Application job ID
CreatedAt
```

---

# 75. SLUG SYSTEM

Generate SEO-friendly slugs.

Example:

```text
Full Stack Developer
```

becomes:

```text
full-stack-developer
```

Ensure uniqueness.

---

# 76. PAGINATION

Use pagination for:

```text
Jobs
Applications
Candidates
Blogs
Projects
Leads
Messages
```

Do not load thousands of database records at once.

---

# 77. ADMIN TABLES

Admin tables should include:

```text
Search
Filter
Sort
Pagination
View
Edit
Delete
Export
Status
```

---

# 78. DASHBOARD SIDEBAR

Admin sidebar:

```text
Dashboard

Recruitment
    Jobs
    Candidates
    Applications
    Hiring Requests

Internships
    Programs
    Applications

Training
    Programs
    Registrations

Content
    Projects
    Case Studies
    Testimonials
    Blogs

Marketing
    Leads
    Newsletter

Communication
    Contact Messages

Analytics

Settings
```

---

# 79. ADMIN SETTINGS

Include:

```text
Company Information
Contact Information
Social Links
Logo
SEO
Email Settings
Notification Settings
User Management
Security
```

---

# 80. TESTING

Implement testing strategy.

Frontend:

```text
Component tests
Form tests
Routing tests
API mocking
```

Backend:

```text
Unit tests
API tests
Authentication tests
Validation tests
```

Important test cases:

```text
Registration
Login
Invalid login
Job listing
Job application
Internship application
Contact form
Admin access
Unauthorized access
File upload
```

---

# 81. GIT WORKFLOW

Use:

```text
main
develop
feature/*
bugfix/*
```

Commit format:

```text
feat: add jobs listing page
feat: add internship application
fix: resolve login validation
refactor: improve job service
docs: update README
```

---

# 82. README

Create a complete README containing:

```text
Project Overview
Features
Tech Stack
Project Structure
Installation
Environment Variables
Running Frontend
Running Backend
Database Setup
API Documentation
Authentication
Admin Setup
Testing
Build
Deployment
Troubleshooting
```

---

# 83. DEVELOPMENT PHASES

Do NOT try to build everything at once.

Build in phases.

## PHASE 1 — Project Setup

Create:

```text
Frontend
Backend
MongoDB connection
Environment variables
ESLint
Prettier
Git setup
Basic routing
```

---

## PHASE 2 — Design System

Create:

```text
Theme
Colors
Typography
Buttons
Cards
Navbar
Footer
Responsive layout
```

---

## PHASE 3 — Public Website

Build:

```text
Home
About
Services
IT Services
Non-IT Services
Digital Marketing
Staffing
Contact
```

---

## PHASE 4 — Recruitment

Build:

```text
Jobs
Job Details
Candidate Registration
Login
Job Application
Candidate Dashboard
```

---

## PHASE 5 — Internships

Build:

```text
Internships
Internship Details
Application
Application Management
```

---

## PHASE 6 — Training

Build:

```text
Training Programs
Program Details
Registration
```

---

## PHASE 7 — Projects

Build:

```text
Projects
Project Details
Case Studies
Success Stories
Testimonials
```

---

## PHASE 8 — Blog

Build:

```text
Blog
Blog Details
Categories
Tags
Search
```

---

## PHASE 9 — Admin

Build:

```text
Admin Login
Dashboard
Jobs
Applications
Candidates
Internships
Training
Projects
Blogs
Testimonials
Leads
Messages
Settings
```

---

## PHASE 10 — Security

Implement:

```text
JWT
Refresh tokens
RBAC
Validation
Rate limiting
Helmet
Secure file uploads
```

---

## PHASE 11 — SEO & Performance

Implement:

```text
SEO
Sitemap
Robots
Metadata
Image optimization
Lazy loading
Code splitting
Caching
```

---

## PHASE 12 — Testing

Test:

```text
Frontend
Backend
Authentication
Forms
API
Admin
Responsive layouts
```

---

## PHASE 13 — Deployment

Prepare deployment for:

```text
Frontend → Vercel/Netlify
Backend → Render/Railway/AWS/Azure
Database → MongoDB Atlas
File Storage → Cloudinary/AWS S3
```

Use environment variables in production.

---

# 84. CURSOR DEVELOPMENT RULES

When using Cursor, follow these rules strictly.

### Rule 1

Do not generate the entire application in one step.

### Rule 2

Build one phase at a time.

### Rule 3

Before creating new files, inspect the existing project structure.

### Rule 4

Do not overwrite working code unnecessarily.

### Rule 5

Reuse existing components.

### Rule 6

Keep frontend and backend separated.

### Rule 7

Do not hardcode credentials.

### Rule 8

Do not create fake production data.

### Rule 9

Use mock data only during development and clearly separate it from production APIs.

### Rule 10

After every major phase:

```text
Run application
Check console
Check API
Fix errors
Check responsive design
Continue only after the phase works
```

---

# 85. MASTER CURSOR PROMPT

Use the following prompt in Cursor:

```text
You are the lead full-stack architect and senior software engineer responsible for building the Quantum Digital Labs Pvt. Ltd. website.

Read the complete project specification in this Markdown file before making changes.

Your task is to build a production-ready, responsive, secure, scalable corporate website for Quantum Digital Labs Pvt. Ltd.

Technology stack:

Frontend:
React
TypeScript
Vite
React Router
Material UI
Axios
Redux Toolkit where necessary
React Hook Form
Zod
Framer Motion
Chart.js
Three.js only where useful

Backend:
Node.js
Express
TypeScript
JWT
bcrypt
REST APIs
MongoDB
Mongoose

Architecture:
Use a clean modular architecture.

Frontend:
components
pages
layouts
sections
services
hooks
store
types
utils
routes
theme

Backend:
routes
controllers
services
models
validators
middleware
config
utils

Important requirements:

1. Build the application incrementally.
2. Never attempt to generate the complete application in a single response.
3. First inspect the current project structure.
4. Determine which phase has already been completed.
5. Work only on the requested phase.
6. Do not break existing functionality.
7. Reuse existing components.
8. Keep code production-quality.
9. Use TypeScript strict typing.
10. Avoid any unnecessary "any" types.
11. Never hardcode secrets.
12. Use .env files for credentials.
13. Validate all API input.
14. Implement centralized error handling.
15. Implement role-based access control.
16. Secure all admin routes.
17. Validate uploaded files.
18. Make all pages responsive.
19. Optimize performance.
20. Follow accessibility best practices.
21. Follow SEO best practices.
22. Use reusable components.
23. Keep business logic in services.
24. Keep controllers thin.
25. Keep routes clean.
26. Use MongoDB indexes where appropriate.
27. Implement pagination for large datasets.
28. Implement loading, empty, success and error states.
29. Do not create fake credentials.
30. Do not expose private information in frontend code.

Before writing code:

- Inspect existing files.
- Explain briefly what you found.
- Identify files that need to be created or modified.
- Implement the requested phase.
- Run/check the relevant code.
- Fix compilation errors.
- Fix TypeScript errors.
- Fix lint errors.
- Verify routing.
- Verify API integration.
- Verify responsive behavior.

After completing the phase, provide:

1. Files created
2. Files modified
3. Features implemented
4. APIs created
5. Database models created
6. Environment variables required
7. Commands to run
8. Any remaining issues

Do not move to the next phase unless explicitly requested.

The website must represent Quantum Digital Labs Pvt. Ltd. as a professional technology, staffing, recruitment, training, internship, project development and digital marketing organization.

Follow the complete website specification in this file as the source of truth.
```

---

# 86. FIRST CURSOR PROMPT

Start the project with this prompt:

```text
Read the Quantum Digital Labs website specification Markdown file completely.

Start PHASE 1 only.

Create the complete project foundation for:

Quantum Digital Labs Pvt. Ltd.

Set up:

1. React + TypeScript + Vite frontend
2. Node.js + Express + TypeScript backend
3. MongoDB/Mongoose configuration
4. Environment configuration
5. ESLint
6. Prettier
7. Git configuration
8. Basic frontend routing
9. Basic backend routing
10. Centralized API configuration
11. Error handling foundation
12. Folder architecture
13. Basic responsive layout
14. Basic theme
15. README

Do not build jobs, internships, admin dashboard or other business modules yet.

First inspect the existing repository.

If the repository is empty, initialize the project.

After implementation, verify that both frontend and backend can run successfully.

Do not proceed to Phase 2.
```

---

# 87. SECOND CURSOR PROMPT

After Phase 1 works:

```text
Read the Quantum Digital Labs website specification.

PHASE 1 is complete.

Now implement PHASE 2 only.

Build the complete design system:

- Brand theme
- Typography
- Colors
- Buttons
- Cards
- Form components
- Navbar
- Footer
- Responsive container
- Section headers
- CTA component
- Loading components
- Error components
- Empty state
- Toast/notification system

Create a professional Quantum Digital Labs visual identity.

Use a premium technology-company design style.

Do not implement Jobs, Internships, Admin or Backend business modules yet.

Verify responsive behavior before finishing.
```

---

# 88. THIRD CURSOR PROMPT

```text
Read the Quantum Digital Labs website specification.

PHASE 1 and PHASE 2 are complete.

Now implement PHASE 3 only.

Build the public corporate website:

- Home
- About
- Services
- IT Services
- Non-IT Services
- Digital Marketing
- Staffing & Recruitment
- Contact
- Get Quote
- Hire Talent

Use reusable components.

Connect forms to backend APIs where the corresponding backend functionality exists.

Do not build the Admin Dashboard yet.

Ensure all pages are responsive, accessible, SEO-ready and visually consistent.

After implementation, test every route.
```

---

# 89. IMPORTANT CONTENT RULE

Do not invent:

* Company registration numbers
* Physical address
* Phone numbers
* Email addresses
* Client names
* Employee names
* Certifications
* Awards
* Statistics
* Testimonials
* Partnerships

Use placeholders such as:

```text
[COMPANY EMAIL]
[COMPANY PHONE]
[OFFICE ADDRESS]
[COMPANY LOGO]
```

until official company information is provided.

---

# 90. FINAL QUALITY CHECK

Before considering the website complete, verify:

```text
[ ] All pages load
[ ] Navigation works
[ ] Mobile responsive
[ ] Tablet responsive
[ ] Desktop responsive
[ ] Forms validate
[ ] Forms submit
[ ] API works
[ ] MongoDB works
[ ] Authentication works
[ ] JWT works
[ ] RBAC works
[ ] Admin routes protected
[ ] Resume upload works
[ ] Job application works
[ ] Internship application works
[ ] Training registration works
[ ] Lead generation works
[ ] Hiring request works
[ ] Blog works
[ ] Projects work
[ ] SEO metadata exists
[ ] 404 page works
[ ] Error handling works
[ ] Loading states work
[ ] Accessibility checked
[ ] Security checked
[ ] No secrets committed
[ ] Production build succeeds
[ ] README updated
```

---

# 91. FINAL PROJECT GOAL

The final Quantum Digital Labs website should function as a complete digital platform rather than only a static corporate website.

It should connect:

```text
BUSINESSES
     │
     ├── IT SERVICES
     ├── NON-IT SERVICES
     ├── DIGITAL MARKETING
     ├── STAFFING
     └── HIRING
             │
             ▼
     QUANTUM DIGITAL LABS
             │
     ├── JOB SEEKERS
     ├── STUDENTS
     ├── INTERNS
     ├── TRAINING
     └── PROJECTS
```

The final platform should provide a seamless experience for:

```text
Business → Service → Lead → Communication

Company → Hiring Requirement → Candidate → Recruitment

Student → Internship → Application → Selection

Student/Professional → Training → Registration → Program

Client → Project → Case Study → Success Story
```

Build the platform with scalability in mind so additional services, users, jobs, training programs, projects, and business modules can be added without restructuring the entire application.

**Quantum Digital Labs Pvt. Ltd. should be presented as a modern, trustworthy, technology-driven digital solutions and talent organization.**
