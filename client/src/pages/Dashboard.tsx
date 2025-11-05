import { useAuth } from "@/contexts/AuthContext";
import BrokerDashboard from "./BrokerDashboard";
import AdminDashboard from "./AdminDashboard";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return user.role === "admin" ? <AdminDashboard /> : <BrokerDashboard />;
}
