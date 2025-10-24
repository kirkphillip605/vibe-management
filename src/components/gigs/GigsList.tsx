import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Calendar, DollarSign, UserPlus, CheckCircle, Pencil, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Gig {
  id: string;
  status: string;
  start_datetime: string;
  end_datetime: string;
  quoted_amount: number;
  is_recurring: boolean;
  customers: { full_name: string; business_name: string | null };
  venues: { name: string };
}

const statusColors: Record<string, "zinc" | "sky" | "amber" | "lime" | "red"> = {
  draft: "zinc",
  scheduled: "sky",
  in_progress: "amber",
  completed: "lime",
  canceled: "red",
};

export const GigsList = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select("*, customers(full_name, business_name), venues(name)")
        .order("start_datetime", { ascending: true });

      if (error) throw error;
      setGigs(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error loading gigs",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id: string, gigName: string) => {
    try {
      const { error } = await supabase
        .from("gigs")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Gig marked as complete",
        description: `${gigName} has been completed.`,
      });

      loadGigs();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error updating gig",
        description: errorMessage,
      });
    }
  };

  const handleCancelGig = async (id: string, gigName: string) => {
    if (!confirm(`Are you sure you want to cancel ${gigName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("gigs")
        .update({ status: "canceled" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Gig canceled",
        description: `${gigName} has been canceled.`,
      });

      loadGigs();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error canceling gig",
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">Loading gigs...</div>;
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-950/10 dark:border-white/10 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">No gigs scheduled. Create your first gig to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Date & Time</TableHeader>
          <TableHeader>Customer</TableHeader>
          <TableHeader>Venue</TableHeader>
          <TableHeader>Amount</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {gigs.map((gig) => {
          const gigName = `${gig.customers.full_name} at ${gig.venues.name}`;
          return (
            <TableRow key={gig.id}>
              <TableCell>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">
                      {format(new Date(gig.start_datetime), "MMM dd, yyyy")}
                    </div>
                    <div className="text-zinc-500 dark:text-zinc-400">
                      {format(new Date(gig.start_datetime), "h:mm a")} -{" "}
                      {format(new Date(gig.end_datetime), "h:mm a")}
                    </div>
                    {gig.is_recurring && (
                      <Badge color="zinc" className="mt-1">
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{gig.customers.full_name}</div>
                  {gig.customers.business_name && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {gig.customers.business_name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{gig.venues.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {gig.quoted_amount.toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                <Badge color={statusColors[gig.status]}>
                  {gig.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button color="zinc" title="Assign DJ">
                    <UserPlus />
                  </Button>
                  <Button color="zinc" title="Edit">
                    <Pencil />
                  </Button>
                  {gig.status !== "completed" && gig.status !== "canceled" && (
                    <>
                      <Button
                        color="lime"
                        onClick={() => handleMarkComplete(gig.id, gigName)}
                        title="Mark Complete"
                      >
                        <CheckCircle />
                      </Button>
                      <Button
                        color="red"
                        onClick={() => handleCancelGig(gig.id, gigName)}
                        title="Cancel Gig"
                      >
                        <XCircle />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
