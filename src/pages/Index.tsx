import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Calendar, Users, Disc3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Music className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Entertainment Manager
          </h1>
          
          <p className="mb-8 max-w-2xl text-xl text-muted-foreground">
            Professional management system for karaoke and DJ entertainment operations.
            Streamline your bookings, track events, manage talent, and handle billing all in one place.
          </p>

          <div className="flex gap-4">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <Calendar className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Event Management</h3>
              <p className="text-sm text-muted-foreground">
                Schedule gigs, track recurring events, and manage your calendar effortlessly.
              </p>
            </div>
            
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <Users className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Customer Relations</h3>
              <p className="text-sm text-muted-foreground">
                Maintain detailed customer profiles, venues, and complete contact history.
              </p>
            </div>
            
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <Disc3 className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">DJ Management</h3>
              <p className="text-sm text-muted-foreground">
                Assign talent to events, track payouts, and manage DJ profiles and documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
