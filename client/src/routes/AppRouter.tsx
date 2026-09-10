import { Route, Routes } from 'react-router-dom';
import { AdminGuestRoute } from '../components/auth/AdminGuestRoute';
import { GuestRoute } from '../components/auth/GuestRoute';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { ROUTES } from '../constants';
import { AdminLayout, MainLayout } from '../layouts';
import { AboutPage } from '../pages/AboutPage';
import { AdminAboutPage } from '../pages/admin/AdminAboutPage';
import {
  AdminBlogEditor,
  AdminBlogList,
  AdminInternshipEditor,
  AdminInternshipsList,
  AdminJobEditor,
  AdminJobsList,
  AdminPortfolioEditor,
  AdminPortfolioList,
  AdminProjectEditor,
  AdminProjectsList,
} from '../pages/admin/AdminContentKindPages';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import {
  AdminServiceEditorPage,
  AdminServicesListPage,
} from '../pages/admin/AdminServicesPages';
import { ApplicationsAdminPage } from '../pages/admin/ApplicationsAdminPage';
import { BlogCategoryPage, BlogDetailPage, BlogPage } from '../pages/blog/BlogPages';
import { AppliedJobsPage } from '../pages/careers/AppliedJobsPage';
import { JobApplyPage } from '../pages/careers/JobApplyPage';
import { JobDetailPage } from '../pages/careers/JobDetailPage';
import { JobsPage } from '../pages/careers/JobsPage';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { AppliedInternshipsPage } from '../pages/internships/AppliedInternshipsPage';
import { InternshipApplyPage } from '../pages/internships/InternshipApplyPage';
import { InternshipDetailPage } from '../pages/internships/InternshipDetailPage';
import { InternshipsPage } from '../pages/internships/InternshipsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import {
  PortfolioCaseStudyPage,
  PortfolioDetailPage,
  PortfolioPage,
} from '../pages/portfolio/PortfolioPages';
import { ProjectDetailPage, ProjectsPage } from '../pages/projects/ProjectsPages';
import { RequestDemoPage } from '../pages/projects/RequestDemoPage';
import { QuotePage } from '../pages/QuotePage';
import { ServiceCategoryPage } from '../pages/ServiceCategoryPage';
import { ServiceDetailPage } from '../pages/ServiceDetailPage';
import { ServicesPage } from '../pages/ServicesPage';
import { NotFoundPage, PrivacyPage, TermsPage } from '../pages/SystemPages';

const staffRoles = ['admin', 'editor'] as const;

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path={ROUTES.adminLogin}
          element={
            <AdminGuestRoute>
              <AdminLoginPage />
            </AdminGuestRoute>
          }
        />

        <Route
          path={ROUTES.admin}
          element={
            <ProtectedRoute roles={[...staffRoles]} loginPath={ROUTES.adminLogin}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="services" element={<AdminServicesListPage />} />
          <Route path="services/new" element={<AdminServiceEditorPage />} />
          <Route
            path="services/:categoryId/:slug"
            element={<AdminServiceEditorPage />}
          />
          <Route path="jobs" element={<AdminJobsList />} />
          <Route path="jobs/new" element={<AdminJobEditor />} />
          <Route path="jobs/:id" element={<AdminJobEditor />} />
          <Route path="internships" element={<AdminInternshipsList />} />
          <Route path="internships/new" element={<AdminInternshipEditor />} />
          <Route path="internships/:id" element={<AdminInternshipEditor />} />
          <Route path="projects" element={<AdminProjectsList />} />
          <Route path="projects/new" element={<AdminProjectEditor />} />
          <Route path="projects/:id" element={<AdminProjectEditor />} />
          <Route path="portfolio" element={<AdminPortfolioList />} />
          <Route path="portfolio/new" element={<AdminPortfolioEditor />} />
          <Route path="portfolio/:id" element={<AdminPortfolioEditor />} />
          <Route path="blog" element={<AdminBlogList />} />
          <Route path="blog/new" element={<AdminBlogEditor />} />
          <Route path="blog/:id" element={<AdminBlogEditor />} />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="applications" element={<ApplicationsAdminPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path={ROUTES.login}
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.register}
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
          <Route path={ROUTES.privacy} element={<PrivacyPage />} />
          <Route path={ROUTES.terms} element={<TermsPage />} />

          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.services} element={<ServicesPage />} />
          <Route path="/services/:categoryId" element={<ServiceCategoryPage />} />
          <Route path="/services/:categoryId/:serviceSlug" element={<ServiceDetailPage />} />

          <Route path={ROUTES.jobs} element={<JobsPage />} />
          <Route
            path={ROUTES.jobsApplied}
            element={
              <ProtectedRoute>
                <AppliedJobsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route
            path="/jobs/:jobId/apply"
            element={
              <ProtectedRoute>
                <JobApplyPage />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.internships} element={<InternshipsPage />} />
          <Route
            path={ROUTES.internshipsApplied}
            element={
              <ProtectedRoute>
                <AppliedInternshipsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/internships/:internshipId" element={<InternshipDetailPage />} />
          <Route
            path="/internships/:internshipId/apply"
            element={
              <ProtectedRoute>
                <InternshipApplyPage />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.projects} element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path={ROUTES.requestDemo} element={<RequestDemoPage />} />

          <Route path={ROUTES.portfolio} element={<PortfolioPage />} />
          <Route path="/portfolio/:projectId" element={<PortfolioDetailPage />} />
          <Route path="/portfolio/:projectId/case-study" element={<PortfolioCaseStudyPage />} />

          <Route path={ROUTES.blog} element={<BlogPage />} />
          <Route path="/blog/category/:category" element={<BlogCategoryPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          <Route path={ROUTES.contact} element={<ContactPage />} />
          <Route
            path={ROUTES.quote}
            element={
              <ProtectedRoute>
                <QuotePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
