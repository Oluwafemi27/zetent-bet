import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useToast } from "@/hooks/use-toast";
import { Download, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const GGRReport: React.FC = () => {
  const [data, setData] = useState({ totalStaked: 0, totalWon: 0, ggr: 0, margin: 0, totalBets: 0, totalDeposits: 0, totalWithdrawals: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [bets, txs] = await Promise.all([
          supabase.from("bets").select("amount, potential_win, status"),
          supabase.from("transactions").select("type, amount, status"),
        ]);
        const allBets = bets.data || [];
        const allTxs = txs.data || [];
        const settled = allBets.filter(b => b.status === "won" || b.status === "lost");
        const staked = settled.reduce((s, b) => s + Number(b.amount), 0);
        const won = allBets.filter(b => b.status === "won").reduce((s, b) => s + Number(b.potential_win), 0);
        const deps = allTxs.filter(t => t.type === "deposit" && (t.status === "completed" || t.status === "success")).reduce((s, t) => s + Number(t.amount), 0);
        const wits = allTxs.filter(t => t.type === "withdrawal" && (t.status === "completed" || t.status === "success")).reduce((s, t) => s + Number(t.amount), 0);
        const ggr = staked - won;
        setData({ totalStaked: staked, totalWon: won, ggr, margin: staked > 0 ? (ggr / staked) * 100 : 0, totalBets: allBets.length, totalDeposits: deps, totalWithdrawals: wits });
      } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const stats = [
    { label: "Total Staked", value: `₦${data.totalStaked.toLocaleString()}`, icon: <Activity className="h-6 w-6 text-blue-500" />, color: "text-blue-600" },
    { label: "Total Paid Out", value: `₦${data.totalWon.toLocaleString()}`, icon: <TrendingDown className="h-6 w-6 text-red-500" />, color: "text-red-600" },
    { label: "GGR", value: `₦${data.ggr.toLocaleString()}`, icon: <TrendingUp className="h-6 w-6 text-green-500" />, color: data.ggr >= 0 ? "text-green-600" : "text-red-600" },
    { label: "Margin", value: `${data.margin.toFixed(2)}%`, icon: <DollarSign className="h-6 w-6 text-purple-500" />, color: "text-purple-600" },
    { label: "Total Deposits", value: `₦${data.totalDeposits.toLocaleString()}`, icon: <TrendingUp className="h-6 w-6 text-emerald-500" />, color: "text-emerald-600" },
    { label: "Total Withdrawals", value: `₦${data.totalWithdrawals.toLocaleString()}`, icon: <TrendingDown className="h-6 w-6 text-orange-500" />, color: "text-orange-600" },
  ];

  const handleExport = () => {
    const csv = Object.entries(data).map(([k, v]) => `${k},${v}`).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "ggr-report.csv"; a.click();
  };

  return (
    <AdminPageShell title="GGR Report" description="Gross Gaming Revenue and financial summary." actions={<Button variant="outline" className="gap-2" onClick={handleExport}><Download className="h-4 w-4" />Export</Button>}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <Card key={s.label}><CardContent className="pt-6">
            <div className="flex justify-between items-start">{s.icon}<div className="text-right"><p className="text-xs text-muted-foreground">{s.label}</p><p className={`text-lg font-bold ${s.color}`}>{loading ? "..." : s.value}</p></div></div>
          </CardContent></Card>
        ))}
      </div>
    </AdminPageShell>
  );
};
export default GGRReport;
