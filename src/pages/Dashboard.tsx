import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Disc3, 
  LogOut,
  DollarSign,
  FileText,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";
import { CustomersView } from "@/components/customers/CustomersView";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (profile) setUserName(profile.full_name);
      if (role) setUserRole(role.role);
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Signed out successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Disc3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Entertainment Manager</h1>
                <p className="text-xs text-muted-foreground">
                  {userRole === "admin" ? "Admin Dashboard" : "DJ Dashboard"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{userName}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6">
          {userRole === "admin" ? (
            <Tabs defaultValue="customers" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="customers">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="venues">
                  <MapPin className="mr-2 h-4 w-4" />
                  Venues
                </TabsTrigger>
                <TabsTrigger value="gigs">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gigs
                </TabsTrigger>
                <TabsTrigger value="djs">
                  <Disc3 className="mr-2 h-4 w-4" />
                  DJs
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customers">
                <CustomersView />
              </TabsContent>

              <TabsContent value="venues">
                <Card>
                  <CardHeader>
                    <CardTitle>Venues</CardTitle>
                    <CardDescription>Manage your event venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Venue management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gigs">
                <Card>
                  <CardHeader>
                    <CardTitle>Gigs</CardTitle>
                    <CardDescription>Schedule and manage events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Gig management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="djs">
                <Card>
                  <CardHeader>
                    <CardTitle>DJ Profiles</CardTitle>
                    <CardDescription>Manage DJ information and documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">DJ management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing & Payments</CardTitle>
                    <CardDescription>Track invoices and payouts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Billing management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Schedule</CardTitle>
                  <CardDescription>View your assigned gigs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No upcoming gigs scheduled.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Payouts</CardTitle>
                  <CardDescription>Track your earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No payout information available.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
