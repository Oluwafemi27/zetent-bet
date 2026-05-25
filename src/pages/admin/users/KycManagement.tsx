import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, ShieldCheck, FileText, UserCheck, AlertCircle } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";

interface KycRequest {
  id: string;
  user_id: string;
  user_name: string;
  status: "pending" | "approved" | "rejected";
  document_type: string;
  submitted_at: string;
  reviewed_at?: string;
}

const KycManagement: React.FC = () => {
  const [kycRequests, setKycRequests] = useState<KycRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadKycRequests();
  }, []);

  const loadKycRequests = async () => {
    try {
      // Mock KYC data - would fetch from database
      const mockRequests: KycRequest[] = [
        {
          id: "1",
          user_id: "user1",
          user_name: "John Doe",
          status: "pending",
          document_type: "National ID",
          submitted_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "2",
          user_id: "user2",
          user_name: "Jane Smith",
          status: "pending",
          document_type: "Passport",
          submitted_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "3",
          user_id: "user3",
          user_name: "Ahmed Musa",
          status: "approved",
          document_type: "Voter's Card",
          submitted_at: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      setKycRequests(mockRequests);
    } catch (err: any) {
      toast({ title: "Error loading KYC requests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const approveKyc = async (id: string) => {
    try {
      toast({ title: "KYC approved successfully" });
      loadKycRequests();
    } catch (err: any) {
      toast({ title: "Error approving KYC", variant: "destructive" });
    }
  };

  const rejectKyc = async (id: string) => {
    try {
      toast({ title: "KYC rejected" });
      loadKycRequests();
    } catch (err: any) {
      toast({ title: "Error rejecting KYC", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const pendingRequests = kycRequests.filter((r) => r.status === "pending");
  const approvedRequests = kycRequests.filter((r) => r.status === "approved");
  const rejectedRequests = kycRequests.filter((r) => r.status === "rejected");

  return (
    <AdminPageShell
      title="KYC & Verification"
      description="Manage user identity verification requests and documents."
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-amber-200/50 bg-amber-50/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Pending Review</p>
                <p className="text-3xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200/50 bg-green-50/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Verified Users</p>
                <p className="text-3xl font-bold">{approvedRequests.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200/50 bg-red-50/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-3xl font-bold">{rejectedRequests.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Pending Section */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-secondary/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto opacity-10 mb-3" />
                <p>All clear! No pending verification requests.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-secondary/10 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {req.user_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{req.user_name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <FileText className="h-3.5 w-3.5" />
                          {req.document_type}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(req.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                      <Button variant="default" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700" onClick={() => approveKyc(req.id)}>
                        Approve
                      </Button>
                      <Button variant="outline" className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectKyc(req.id)}>
                        Reject
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Docs
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Processed */}
        <Card className="border-border/40 opacity-80">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recently Processed</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {kycRequests.filter(r => r.status !== 'pending').map((req) => (
                <div key={req.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${req.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium">{req.user_name}</span>
                    <span className="text-xs text-muted-foreground">• {req.document_type}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
};

export default KycManagement;
