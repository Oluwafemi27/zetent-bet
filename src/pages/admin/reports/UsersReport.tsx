import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useToast } from "@/hooks/use-toast";
import { Download, Users, UserCheck, UserX, TrendingUp } from "lucide-react";

const UsersReport: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, banned: 0, verified: 0, newToday: 0 });
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from("profiles").select("id, full_name, email, balance, status, kyc_verified, created_at");
        const users = data || [];
        const today = new Date(); today.setHours(0, 0, 0, 0);
        setStats({ total: users.length, active: users.filter(u => u.status !== "banned").length, banned: users.filter(u => u.status === "banned").length, verified: users.filter(u => u.kyc_verified).length, newToday: users.filter(u => new Date(u.created_at) >= today).length });
        setTopUsers(users.sort((a, b) => Number(b.balance) - Number(a.balance)).slice(0, 10));
      } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleExport = () => {
    const csv = [["Name", "Email", "Balance", "Status", "KYC"], ...topUsers.map(u => [u.full_name, u.email, u.balance, u.status, u.kyc_verified])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "users-report.csv"; a.click();
  };

  return (
    <AdminPageShell title="Users Report" description="User statistics and top players by balance." actions={<Button variant="outline" className="gap-2" onClick={handleExport}><Download className="h-4 w-4" />Export</Button>}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[{ label: "Total Users", value: stats.total, icon: <Users className="h-5 w-5 text-blue-500" /> },
            { label: "Active", value: stats.active, icon: <UserCheck className="h-5 w-5 text-green-500" /> },
            { label: "Banned", value: stats.banned, icon: <UserX className="h-5 w-5 text-red-500" /> },
            { label: "KYC Verified", value: stats.verified, icon: <UserCheck className="h-5 w-5 text-purple-500" /> },
            { label: "New Today", value: stats.newToday, icon: <TrendingUp className="h-5 w-5 text-amber-500" /> }]
            .map(s => <Card key={s.label}><CardContent className="pt-4"><div className="flex items-center gap-2">{s.icon}<div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{loading ? "..." : s.value}</p></div></div></CardContent></Card>)}
        </div>

        <Card className="border border-border/50 overflow-hidden"><CardContent className="p-0">
          <div className="px-6 py-4 border-b font-bold">Top 10 Users by Balance</div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-border/30 bg-secondary/30">{["#", "User", "Email", "Balance", "Status"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody>{topUsers.map((u, i) => (
              <tr key={u.id} className={`border-b border-border/20 ${i % 2 === 0 ? "bg-background/50" : "bg-background"}`}>
                <td className="px-4 py-3 font-bold text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{u.full_name || "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 font-bold font-mono">₦{Number(u.balance).toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${u.status === "banned" ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"}`}>{(u.status || "active").toUpperCase()}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        </CardContent></Card>
      </div>
    </AdminPageShell>
  );
};
export default UsersReport;
