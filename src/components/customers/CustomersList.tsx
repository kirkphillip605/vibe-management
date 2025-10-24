import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Mail, Phone, Building2, Pencil, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/badge";

interface Customer {
  id: string;
  full_name: string;
  business_name: string | null;
  email: string;
  phone: string;
  created_at: string;
}

export const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error loading customers",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: `${name} has been removed from the database.`,
      });

      loadCustomers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error deleting customer",
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-950/10 dark:border-white/10 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">No customers yet. Create your first customer to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Business</TableHeader>
          <TableHeader>Contact</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.full_name}</TableCell>
            <TableCell>
              {customer.business_name ? (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  {customer.business_name}
                </div>
              ) : (
                <span className="text-zinc-500 dark:text-zinc-400">—</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                  {customer.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button color="zinc" title="Add Note">
                  <FileText />
                </Button>
                <Button color="zinc" title="Edit">
                  <Pencil />
                </Button>
                <Button
                  color="red"
                  onClick={() => handleDelete(customer.id, customer.full_name)}
                  title="Delete"
                >
                  <Trash2 />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
