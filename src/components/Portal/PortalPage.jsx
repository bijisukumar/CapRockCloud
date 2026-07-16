import DashboardLayout from "./DashboardLayout.jsx";

// Auth boundary lives here down the road (session check, redirect to login).
// For now this simply renders the dashboard shell.
export default function PortalPage() {
  return <DashboardLayout />;
}
