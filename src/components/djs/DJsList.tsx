import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Mail, Phone, FileText, Pencil, Trash2, Upload, Eye } from "lucide-react";
import { Badge } from "@/components/badge";

interface DJ {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  employment_status: string;
  dj_documents: { count: number }[];
}

export const DJsList = () => {
  const [djs, setDJs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDJs();
  }, []);

  const loadDJs = async () => {
    try {
      const { data, error } = await supabase
        .from("dj_profiles")
        .select("id, full_name, email, phone, employment_status, dj_documents(count)")
        .order("full_name");

      if (error) throw error;
      setDJs(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error loading DJs",
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
      const { error } = await supabase.from("dj_profiles").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "DJ deleted",
        description: `${name} has been removed from the database.`,
      });

      loadDJs();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error deleting DJ",
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">Loading DJs...</div>;
  }

  if (djs.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-950/10 dark:border-white/10 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">No DJ profiles yet. Create your first DJ profile to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Contact</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Documents</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {djs.map((dj) => (
          <TableRow key={dj.id}>
            <TableCell className="font-medium">{dj.full_name}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                  {dj.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                  {dj.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge color="zinc">{dj.employment_status}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                <FileText className="h-3 w-3" />
                {dj.dj_documents?.[0]?.count || 0} files
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button color="zinc" title="Upload Document">
                  <Upload />
                </Button>
                <Button color="zinc" title="View Documents">
                  <Eye />
                </Button>
                <Button color="zinc" title="Edit">
                  <Pencil />
                </Button>
                <Button
                  color="red"
                  onClick={() => handleDelete(dj.id, dj.full_name)}
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
