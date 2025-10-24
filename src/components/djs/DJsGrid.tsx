import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MoreVertical, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DJ {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  employment_status: string;
  dj_documents: { count: number }[];
}

export const DJsGrid = () => {
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading DJs",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading DJs...</div>;
  }

  if (djs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No DJ profiles yet. Create your first DJ profile to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {djs.map((dj) => (
        <Card key={dj.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{dj.full_name}</CardTitle>
                <Badge variant="secondary">{dj.employment_status}</Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Upload Document</DropdownMenuItem>
                  <DropdownMenuItem>View Documents</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{dj.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{dj.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <FileText className="h-4 w-4" />
              <span>{dj.dj_documents?.[0]?.count || 0} documents</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
