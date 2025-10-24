import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/auth/AuthGuard";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (role?.role === "admin") {
        navigate("/dashboard/customers", { replace: true });
      } else {
        navigate("/dashboard/schedule", { replace: true });
      }
    };

    redirectBasedOnRole();
  }, [navigate]);

  return (
    <AuthGuard>
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
