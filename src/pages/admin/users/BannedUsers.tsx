import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Unlock, MoreVertical, Users as UsersIcon, TrendingDown } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";

interface BannedUser {
  id: string;
  full_name: string;
  email: string;
  balance: number;
  created_at: string;
  status: string;
}

const BannedUsers: React.FC = () => {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBannedUsers();

    const channel = supabase
      .channel("banned-users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          loadBannedUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBannedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "banned")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBannedUsers(data || []);
    } catch (err: any) {
      toast({ title: "Error loading banned users", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (userId: string, userName: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "active" })
        .eq("id", userId);
      
      if (error) throw error;
      toast({ title: `${userName} has been unbanned successfully` });
      loadBannedUsers();
    } catch (err: any) {
      toast({ title: "Error unbanning user", description: err.message, variant: "destructive" });
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Balance", "Banned Date"],
      ...bannedUsers.map(u => [u.full_name, u.email, u.balance, u.created_at])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "banned_users.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Exported successfully" });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <AdminPageShell
      title="Banned Users"
      description={`${bannedUsers.length} users are currently banned from the platform.`}
      actions={
        <Button 
          className="gap-2 bg-primary hover:bg-primary/90 h-11 px-6 font-medium"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      }
    >
      <div className="space-y-8">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-card to-card/50 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-red-100/50 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                Banned Users List
              </CardTitle>
              <div className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {bannedUsers.length} results
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/30">
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Balance</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground hidden lg:table-cell">Banned Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bannedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-border/20 transition-colors duration-200 ${
                        idx % 2 === 0 ? "bg-background/50" : "bg-background"
                      } hover:bg-red-50/30`}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div>
                          {user.full_name || "—"}
                          <div className="md:hidden text-xs text-muted-foreground font-normal mt-1">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm hidden md:table-cell">{user.email || "—"}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-foreground">
                        ₦{Number(user.balance).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                        {new Date(user.created_at).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-green-200/50 hover:border-green-400/50 hover:bg-green-50/20 gap-1.5"
                            onClick={() => handleUnban(user.id, user.full_name || user.email)}
                          >
                            <Unlock className="h-3.5 w-3.5" />
                            Unban
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => toast({ title: "Menu options: Coming soon" })}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bannedUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UsersIcon className="h-12 w-12 mx-auto opacity-20 mb-3" />
                <p className="font-medium">No banned users</p>
                <p className="text-sm">Users you ban will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
};

export default BannedUsers;
