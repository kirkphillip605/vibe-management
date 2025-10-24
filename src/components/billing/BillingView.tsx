import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge } from "@/components/badge";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { Text } from "@/components/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Invoice {
  customers?: { full_name: string };
  quoted_amount: number;
  invoiced_amount?: number;
  amount_received?: number;
  status: string;
}

interface Payout {
  dj_profiles?: { full_name: string };
  gigs?: { 
    customers?: { full_name: string };
    start_datetime?: string;
  };
  total_payout: number;
}

export const BillingView = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalQuoted: 0,
    totalInvoiced: 0,
    totalReceived: 0,
    pendingPayouts: 0,
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      // Load gig financial data
      const { data: gigs, error: gigsError } = await supabase
        .from("gigs")
        .select("quoted_amount, invoiced_amount, amount_received, status, customers(full_name)");

      if (gigsError) throw gigsError;

      // Calculate stats
      const quoted = gigs?.reduce((sum, g) => sum + (Number(g.quoted_amount) || 0), 0) || 0;
      const invoiced = gigs?.reduce((sum, g) => sum + (Number(g.invoiced_amount) || 0), 0) || 0;
      const received = gigs?.reduce((sum, g) => sum + (Number(g.amount_received) || 0), 0) || 0;

      // Load payouts
      const { data: assignments, error: assignmentsError } = await supabase
        .from("gig_assignments")
        .select("total_payout, dj_profiles(full_name), gigs(start_datetime, customers(full_name))");

      if (assignmentsError) throw assignmentsError;

      const totalPayouts = assignments?.reduce((sum, a) => sum + (Number(a.total_payout) || 0), 0) || 0;

      setStats({
        totalQuoted: quoted,
        totalInvoiced: invoiced,
        totalReceived: received,
        pendingPayouts: totalPayouts,
      });

      setInvoices(gigs || []);
      setPayouts(assignments || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error loading billing data",
        description: errorMessage,
      });
    }
  };

  return (
    <div>
      <Text className="mb-6">Track invoices, payments, and DJ payouts</Text>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Quoted
            </span>
            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="text-2xl font-bold">${stats.totalQuoted.toFixed(2)}</div>
        </div>

        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Invoiced
            </span>
            <TrendingUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="text-2xl font-bold">${stats.totalInvoiced.toFixed(2)}</div>
        </div>

        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Received
            </span>
            <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-500">
            ${stats.totalReceived.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Pending Payouts
            </span>
            <Users className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            ${stats.pendingPayouts.toFixed(2)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payouts">DJ Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Quoted</TableHeader>
                <TableHeader>Invoiced</TableHeader>
                <TableHeader>Received</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500 dark:text-zinc-400">
                    No invoice data available
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice, i) => (
                  <TableRow key={i}>
                    <TableCell>{invoice.customers?.full_name || "—"}</TableCell>
                    <TableCell>${Number(invoice.quoted_amount).toFixed(2)}</TableCell>
                    <TableCell>
                      {invoice.invoiced_amount
                        ? `$${Number(invoice.invoiced_amount).toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {invoice.amount_received
                        ? `$${Number(invoice.amount_received).toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge color="zinc">{invoice.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="payouts">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>DJ Name</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Event Date</TableHeader>
                <TableHeader>Payout Amount</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-500 dark:text-zinc-400">
                    No payout data available
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout, i) => (
                  <TableRow key={i}>
                    <TableCell>{payout.dj_profiles?.full_name || "—"}</TableCell>
                    <TableCell>{payout.gigs?.customers?.full_name || "—"}</TableCell>
                    <TableCell>
                      {payout.gigs?.start_datetime
                        ? new Date(payout.gigs.start_datetime).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(payout.total_payout).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
