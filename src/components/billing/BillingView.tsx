import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";

export const BillingView = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalQuoted: 0,
    totalInvoiced: 0,
    totalReceived: 0,
    pendingPayouts: 0,
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading billing data",
        description: error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Payments</CardTitle>
        <CardDescription>Track invoices, payments, and DJ payouts</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Quoted
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalQuoted.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Invoiced
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalInvoiced.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Received
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalReceived.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payouts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                ${stats.pendingPayouts.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payouts">DJ Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quoted</TableHead>
                    <TableHead>Invoiced</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
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
                          <Badge variant="secondary">{invoice.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="payouts">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DJ Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Payout Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
