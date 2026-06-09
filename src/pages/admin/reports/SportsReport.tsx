import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

const SportsReport: React.FC = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from("bets").select("amount, potential_win, status, sport, created_at").order("created_at", { ascending: false }).limit(200);
        if (error) throw error;
        setBets(data || []);
      } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Group by sport
  const bySport: Record<string, { staked: number; won: number; count: number }> = {};
  bets.forEach(b => {
    const sport = b.sport || "Unknown";
    if (!bySport[sport]) bySport[sport] = { staked: 0, won: 0, count: 0 };
    bySport[sport].staked += Number(b.amount);
    if (b.status === "won") bySport[sport].won += Number(b.potential_win);
    bySport[sport].count++;
  });

  const handleExport = () => {
    const csv = [["Sport", "Bets", "Staked", "Paid Out", "GGR"], ...Object.entries(bySport).map(([s, d]) => [s, d.count, d.staked, d.won, d.staked - d.won])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "sports-report.csv"; a.click();
  };

  return (
    <AdminPageShell title="Sports Report" description="Betting performance by sport." actions={<Button variant="outline" className="gap-2" onClick={handleExport}><Download className="h-4 w-4" />Export</Button>}>
      <Card className="border border-border/50 overflow-hidden"><CardContent className="p-0">
        {loading ? <p className="text-center py-8 text-muted-foreground">Loading...</p> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-border/30 bg-secondary/30">{["Sport", "Total Bets", "Total Staked", "Paid Out", "GGR"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody>{Object.entries(bySport).map(([sport, d], i) => (
              <tr key={sport} className={`border-b border-border/20 ${i % 2 === 0 ? "bg-background/50" : "bg-background"}`}>
                <td className="px-4 py-3 font-medium capitalize">{sport}</td>
                <td className="px-4 py-3">{d.count}</td>
                <td className="px-4 py-3 font-mono">₦{d.staked.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-red-600">₦{d.won.toLocaleString()}</td>
                <td className={`px-4 py-3 font-mono font-bold ${(d.staked - d.won) >= 0 ? "text-green-600" : "text-red-600"}`}>₦{(d.staked - d.won).toLocaleString()}</td>
              </tr>
            ))}
            {Object.keys(bySport).length === 0 && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No betting data</td></tr>}
            </tbody>
          </table></div>
        )}
      </CardContent></Card>
    </AdminPageShell>
  );
};
export default SportsReport;
