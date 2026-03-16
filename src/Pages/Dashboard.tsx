import { useAuth } from "../context/useAuth";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "ADMIN" || user.role === "OWNER") {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}
