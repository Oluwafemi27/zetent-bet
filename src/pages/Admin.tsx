import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, Receipt, TrendingUp, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
        if (!data) {
          toast({ title: "Access denied", variant: "destructive" });
          navigate("/");
        } else {
          setIsAdmin(true);
          loadData();
        }
        setChecking(false);
      });
    }
  }, [user, loading]);

  const loadData = async () => {
    const [u, b, t, p] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("bets").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("promotions").select("*").order("created_at", { ascending: false }),
    ]);
    setUsers(u.data || []);
    setBets(b.data || []);
    setTransactions(t.data || []);
    setPromotions(p.data || []);
  };

  const togglePromo = async (id: string, isActive: boolean) => {
    await supabase.from("promotions").update({ is_active: !isActive }).eq("id", id);
    loadData();
    toast({ title: `Promotion ${!isActive ? "activated" : "deactivated"}` });
  };

  if (loading || checking) {
    return (
      <div className="container py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container py-6 space-y-6">
      <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Users", value: users.length, icon: Users, color: "text-primary" },
          { label: "Bets", value: bets.length, icon: Receipt, color: "text-naija-gold" },
          { label: "Transactions", value: transactions.length, icon: TrendingUp, color: "text-naija-green-light" },
          { label: "Promotions", value: promotions.length, icon: Megaphone, color: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Balance</th>
                  <th className="p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 20).map((u) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="p-2 font-medium">{u.full_name}</td>
                    <td className="p-2 text-muted-foreground">{u.email}</td>
                    <td className="p-2">₦{u.balance}</td>
                    <td className="p-2 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bets Table */}
      <Card>
        <CardHeader><CardTitle>Recent Bets</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-2">Stake</th>
                  <th className="p-2">Potential Win</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {bets.slice(0, 20).map((b) => (
                  <tr key={b.id} className="border-b border-border/50">
                    <td className="p-2">₦{b.stake}</td>
                    <td className="p-2">₦{b.potential_win}</td>
                    <td className="p-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${b.status === "won" ? "bg-primary/20 text-primary" : b.status === "lost" ? "bg-destructive/20 text-destructive" : "bg-naija-gold/20 text-naija-gold"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-xs">{b.booking_code}</td>
                    <td className="p-2 text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Promotions */}
      <Card>
        <CardHeader><CardTitle>Promotions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {promotions.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
              <Switch checked={p.is_active} onCheckedChange={() => togglePromo(p.id, p.is_active)} />
            </div>
          ))}
          {promotions.length === 0 && <p className="text-sm text-muted-foreground">No promotions yet</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
