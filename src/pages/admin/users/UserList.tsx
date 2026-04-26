import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download, Eye, Lock, MoreVertical, Users as UsersIcon, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  full_name: string;
  email: string;
  balance: number;
  kyc_verified: boolean;
  created_at: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kycFilter, setKycFilter] = useState<"all" | "verified" | "pending">("all");
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, kycFilter, users]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      toast({ title: "Error loading users", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (kycFilter !== "all") {
      filtered = filtered.filter((u) =>
        kycFilter === "verified" ? u.kyc_verified : !u.kyc_verified
      );
    }

    setFilteredUsers(filtered);
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100/20 flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">{filteredUsers.length} total users</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 h-11 px-6 font-medium">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-primary/20 focus:border-primary/40 transition-colors"
              />
            </div>

            <Select value={kycFilter} onValueChange={(v: any) => setKycFilter(v)}>
              <SelectTrigger className="h-10 border-primary/20 focus:border-primary/40">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">KYC Verified</SelectItem>
                <SelectItem value="pending">Pending KYC</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" className="w-full h-10 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-card to-card/50 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              Users List
            </CardTitle>
            <div className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {filteredUsers.length} results
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-secondary/30">
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Balance</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">KYC Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border/20 transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-background/50" : "bg-background"
                    } hover:bg-primary/5`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{user.full_name || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{user.email || "—"}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-foreground">
                      ₦{Number(user.balance).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-bold border ${
                          user.kyc_verified
                            ? "bg-green-100/30 text-green-700 border-green-200/50"
                            : "bg-amber-100/30 text-amber-700 border-amber-200/50"
                        }`}
                      >
                        {user.kyc_verified ? "✓ Verified" : "• Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
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
                          className="h-8 text-xs border-blue-200/50 hover:border-blue-400/50 hover:bg-blue-50/20 gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs border-amber-200/50 hover:border-amber-400/50 hover:bg-amber-50/20 gap-1.5"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          Limit
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <UsersIcon className="h-12 w-12 mx-auto opacity-20 mb-3" />
              <p className="font-medium">No users found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserList;
