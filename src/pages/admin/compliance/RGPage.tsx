import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Shield, AlertTriangle, UserX, Clock } from "lucide-react";

const RGPage: React.FC = () => {
  const [stats, setStats] = useState({ exclusions: 0, highRisk: 0, flagged: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [exc, alerts] = await Promise.all([
          supabase.from("self_exclusions").select("id", { count: "exact" }).eq("status", "active"),
          supabase.from("risk_alerts").select("id", { count: "exact" }).eq("status", "pending"),
        ]);
        setStats({ exclusions: exc.count || 0, highRisk: alerts.count || 0, flagged: 0 });
      } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <AdminPageShell title="Responsible Gaming" description="Monitor player welfare and responsible gaming compliance.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Exclusions", value: stats.exclusions, icon: <UserX className="h-8 w-8 text-red-500 opacity-60" />, color: "text-red-600" },
          { label: "High Risk Alerts", value: stats.highRisk, icon: <AlertTriangle className="h-8 w-8 text-amber-500 opacity-60" />, color: "text-amber-600" },
          { label: "Cooling-off Periods", value: stats.flagged, icon: <Clock className="h-8 w-8 text-blue-500 opacity-60" />, color: "text-blue-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="pt-6">
            <div className="flex items-center justify-between">{s.icon}<div className="text-right"><p className="text-sm text-muted-foreground">{s.label}</p><p className={`text-3xl font-bold ${s.color}`}>{loading ? "..." : s.value}</p></div></div>
          </CardContent></Card>
        ))}
      </div>
      <Card className="mt-6"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Responsible Gaming Policy</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Players can self-exclude for 1 week, 1 month, 6 months, 1 year or permanently</p>
          <p>• Deposit limits can be set by players from their account settings</p>
          <p>• Players flagged for high-risk behavior receive automatic alerts</p>
          <p>• Staff trained to identify signs of problem gambling</p>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
};
export default RGPage;
