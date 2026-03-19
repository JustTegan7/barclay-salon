import { useAuth } from "../context/useAuth";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";
import { ErrorBoundary } from "../Components/ErrorBoundary";
import "../Components/ErrorBoundary.css";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "ADMIN" || user.role === "OWNER") {
    return (
      <ErrorBoundary section="Admin Dashboard">
        <AdminDashboard />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary section="Employee Dashboard">
      <EmployeeDashboard />
    </ErrorBoundary>
  );
}
