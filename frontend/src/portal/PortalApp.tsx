import { Link, Route, Routes } from 'react-router'
import { AuthProvider, RequireRole } from './auth'
import Login from './Login'
import Signup from './Signup'
import PortalLayout from './PortalLayout'
import TicketThread from './TicketThread'
import PartnerOverview from './partner/Overview'
import PartnerOnboarding from './partner/Onboarding'
import PartnerSupport from './partner/Support'
import PartnerReports from './partner/Reports'
import PartnerProfile from './partner/Profile'
import AdminOverview from './admin/Overview'
import AdminPartners from './admin/Partners'
import AdminPartnerDetail from './admin/PartnerDetail'
import AdminEnquiries from './admin/Enquiries'
import AdminTickets from './admin/Tickets'
import { company } from '../content'

/**
 * Partner + admin portal. Loaded as a separate chunk, so the marketing page stays light.
 * Note: there are intentionally no payment, wallet or money-transfer screens.
 */
export default function PortalApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <RequireRole role="partner">
              <PortalLayout />
            </RequireRole>
          }
        >
          <Route index element={<PartnerOverview />} />
          <Route path="onboarding" element={<PartnerOnboarding />} />
          <Route path="support" element={<PartnerSupport />} />
          <Route path="support/:id" element={<TicketThread />} />
          <Route path="reports" element={<PartnerReports />} />
          <Route path="profile" element={<PartnerProfile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <PortalLayout />
            </RequireRole>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="partners/:id" element={<AdminPartnerDetail />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="tickets/:id" element={<TicketThread />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-ink px-6 text-center text-snow">
      <p className="eyebrow text-gold">404</p>
      <h1 className="mt-4 text-5xl font-medium">This page is off target.</h1>
      <p className="mt-4 text-muted">The page you are looking for doesn’t exist.</p>
      <Link to="/" className="btn btn-primary mt-8">
        Back to {company.brand}
      </Link>
    </main>
  )
}
