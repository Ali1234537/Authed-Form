import DashboardClient from "./DashboardClient";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function DashboardPage() {
  return(
    <ProtectedRoute> 
       <DashboardClient/>
     </ProtectedRoute>
  );
}