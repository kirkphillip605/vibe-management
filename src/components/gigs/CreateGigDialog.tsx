import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { CreateCustomerDialog } from "@/components/customers/CreateCustomerDialog";
import { CreateVenueDialog } from "@/components/venues/CreateVenueDialog";

interface CreateGigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateGigDialog = ({ open, onOpenChange }: CreateGigDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showVenueDialog, setShowVenueDialog] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "",
    venue_id: "",
    start_datetime: "",
    end_datetime: "",
    quoted_amount: "",
    is_recurring: false,
    frequency: "",
    recurrence_count: "",
  });

  useEffect(() => {
    if (open) {
      loadCustomers();
      loadVenues();
    }
  }, [open]);

  const loadCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id, full_name, business_name")
      .order("full_name");
    if (data) setCustomers(data);
  };

  const loadVenues = async () => {
    const { data } = await supabase
      .from("venues")
      .select("id, name")
      .order("name");
    if (data) setVenues(data);
  };

  const handleCustomerCreated = (customerId: string) => {
    loadCustomers();
    setFormData({ ...formData, customer_id: customerId });
  };

  const handleVenueCreated = (venueId: string) => {
    loadVenues();
    setFormData({ ...formData, venue_id: venueId });
  };

  const generateRecurringGigs = async (parentGigId: string) => {
    if (!formData.is_recurring || !formData.recurrence_count) return;

    const count = parseInt(formData.recurrence_count);
    const startDate = new Date(formData.start_datetime);
    const endDate = new Date(formData.end_datetime);
    const duration = endDate.getTime() - startDate.getTime();

    const recurringGigs = [];
    for (let i = 1; i < count; i++) {
      let nextStart = new Date(startDate);
      
      if (formData.frequency === "weekly") {
        nextStart.setDate(nextStart.getDate() + (7 * i));
      } else if (formData.frequency === "bi-weekly") {
        nextStart.setDate(nextStart.getDate() + (14 * i));
      } else if (formData.frequency === "monthly") {
        nextStart.setMonth(nextStart.getMonth() + i);
      }

      const nextEnd = new Date(nextStart.getTime() + duration);

      recurringGigs.push({
        customer_id: formData.customer_id,
        venue_id: formData.venue_id,
        start_datetime: nextStart.toISOString(),
        end_datetime: nextEnd.toISOString(),
        quoted_amount: parseFloat(formData.quoted_amount),
        status: "draft",
        parent_gig_id: parentGigId,
        is_recurring: false,
      });
    }

    if (recurringGigs.length > 0) {
      const { error } = await supabase.from("gigs").insert(recurringGigs);
      if (error) throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: parentGig, error } = await supabase
        .from("gigs")
        .insert({
          customer_id: formData.customer_id,
          venue_id: formData.venue_id,
          start_datetime: formData.start_datetime,
          end_datetime: formData.end_datetime,
          quoted_amount: parseFloat(formData.quoted_amount),
          status: "draft" as any,
          is_recurring: formData.is_recurring,
          frequency: formData.is_recurring ? (formData.frequency as any) : null,
          recurrence_count: formData.is_recurring
            ? parseInt(formData.recurrence_count)
            : null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (formData.is_recurring) {
        await generateRecurringGigs(parentGig.id);
      }

      toast({
        title: "Gig created",
        description: formData.is_recurring
          ? `Created ${formData.recurrence_count} recurring gigs`
          : "The gig has been scheduled successfully.",
      });

      onOpenChange(false);
      setFormData({
        customer_id: "",
        venue_id: "",
        start_datetime: "",
        end_datetime: "",
        quoted_amount: "",
        is_recurring: false,
        frequency: "",
        recurrence_count: "",
      });
      
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating gig",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Gig</DialogTitle>
            <DialogDescription>
              Schedule a new event. You can create customers and venues on the fly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customer_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.full_name}
                        {customer.business_name && ` (${customer.business_name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.venue_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, venue_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVenueDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_datetime">Start Date & Time *</Label>
                <Input
                  id="start_datetime"
                  type="datetime-local"
                  value={formData.start_datetime}
                  onChange={(e) =>
                    setFormData({ ...formData, start_datetime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_datetime">End Date & Time *</Label>
                <Input
                  id="end_datetime"
                  type="datetime-local"
                  value={formData.end_datetime}
                  onChange={(e) =>
                    setFormData({ ...formData, end_datetime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quoted_amount">Quoted Amount *</Label>
              <Input
                id="quoted_amount"
                type="number"
                step="0.01"
                value={formData.quoted_amount}
                onChange={(e) =>
                  setFormData({ ...formData, quoted_amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_recurring: checked as boolean })
                  }
                />
                <Label htmlFor="is_recurring">Recurring Event</Label>
              </div>

              {formData.is_recurring && (
                <div className="grid gap-4 sm:grid-cols-2 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, frequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurrence_count">Number of Occurrences *</Label>
                    <Input
                      id="recurrence_count"
                      type="number"
                      min="2"
                      value={formData.recurrence_count}
                      onChange={(e) =>
                        setFormData({ ...formData, recurrence_count: e.target.value })
                      }
                      required={formData.is_recurring}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Gig"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CreateCustomerDialog
        open={showCustomerDialog}
        onOpenChange={setShowCustomerDialog}
        onCustomerCreated={handleCustomerCreated}
      />

      <CreateVenueDialog
        open={showVenueDialog}
        onOpenChange={setShowVenueDialog}
        onVenueCreated={handleVenueCreated}
      />
    </>
  );
};
