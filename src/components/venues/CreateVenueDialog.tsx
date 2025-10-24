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
import { Plus } from "lucide-react";

interface CreateVenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVenueCreated?: (venueId: string) => void;
}

export const CreateVenueDialog = ({ open, onOpenChange, onVenueCreated }: CreateVenueDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [venueTypes, setVenueTypes] = useState<{ id: string; name: string }[]>([]);
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    venue_type_id: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (open) {
      loadVenueTypes();
    }
  }, [open]);

  const loadVenueTypes = async () => {
    const { data } = await supabase
      .from("venue_types")
      .select("*")
      .order("name");
    if (data) setVenueTypes(data);
  };

  const handleCreateNewType = async () => {
    if (!newTypeName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("venue_types")
        .insert({ name: newTypeName.trim() })
        .select()
        .single();

      if (error) throw error;

      setVenueTypes([...venueTypes, data]);
      setFormData({ ...formData, venue_type_id: data.id });
      setNewTypeName("");
      setShowNewTypeInput(false);
      toast({
        title: "Venue type created",
        description: "You can now select it from the list.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating venue type",
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      };

      const { data, error } = await supabase
        .from("venues")
        .insert({
          name: formData.name,
          venue_type_id: formData.venue_type_id || null,
          address,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Venue created",
        description: "The venue has been added successfully.",
      });

      if (onVenueCreated) {
        onVenueCreated(data.id);
      }

      onOpenChange(false);
      setFormData({
        name: "",
        venue_type_id: "",
        street: "",
        city: "",
        state: "",
        zip: "",
      });
      
      if (!onVenueCreated) {
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating venue",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Venue</DialogTitle>
          <DialogDescription>
            Add a new venue to your database. You can create a new venue type on the fly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue_type">Venue Type</Label>
              {showNewTypeInput ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new type"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                  />
                  <Button type="button" onClick={handleCreateNewType} size="sm">
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewTypeInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={formData.venue_type_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, venue_type_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {venueTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewTypeInput(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Venue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
