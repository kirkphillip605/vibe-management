import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const statusColors: Record<string, string> = {
  draft: "bg-muted",
  scheduled: "bg-blue-500",
  in_progress: "bg-amber-500",
  completed: "bg-green-500",
  canceled: "bg-red-500",
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading gigs",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading gigs...</div>;
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No gigs scheduled. Create your first gig to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gigs.map((gig) => (
            <TableRow key={gig.id}>
              <TableCell>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">
                      {format(new Date(gig.start_datetime), "MMM dd, yyyy")}
                    </div>
                    <div className="text-muted-foreground">
                      {format(new Date(gig.start_datetime), "h:mm a")} -{" "}
                      {format(new Date(gig.end_datetime), "h:mm a")}
                    </div>
                    {gig.is_recurring && (
                      <Badge variant="outline" className="mt-1">
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
                    <div className="text-sm text-muted-foreground">
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
                <Badge className={statusColors[gig.status]}>
                  {gig.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign DJ</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Cancel Gig
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
