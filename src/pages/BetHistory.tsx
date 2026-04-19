import Layout from "@/components/layout/Layout";
import BetCard from "@/components/BetCard";
import { usePlacedBets } from "@/contexts/PlacedBetsContext";
import { History } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "won" | "lost" | "cancelled";

const BetHistory = () => {
  const { pastBets } = usePlacedBets();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredBets =
    statusFilter === "all" ? pastBets : pastBets.filter((bet) => bet.status === statusFilter);

  const wonBets = pastBets.filter((bet) => bet.status === "won");
  const lostBets = pastBets.filter((bet) => bet.status === "lost");
  const cancelledBets = pastBets.filter((bet) => bet.status === "cancelled");

  const totalWon = wonBets.reduce((sum, bet) => sum + (bet.result?.wonAmount || 0), 0);
  const totalStaked = pastBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalLost = lostBets.reduce((sum, bet) => sum + bet.stake, 0);

  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Bet History</h1>
        </div>
        <p className="text-sm text-muted-foreground">Review your past and settled bets</p>

        {pastBets.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Total Bets</p>
                <p className="text-xl font-bold">{pastBets.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Total Staked</p>
                <p className="text-xl font-bold">₦{totalStaked.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Won</p>
                <p className="text-xl font-bold text-green-600">₦{totalWon.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Lost</p>
                <p className="text-xl font-bold text-red-600">₦{totalLost.toLocaleString()}</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: "all", label: "All", count: pastBets.length },
                { id: "won", label: "Won", count: wonBets.length },
                { id: "lost", label: "Lost", count: lostBets.length },
                { id: "cancelled", label: "Cancelled", count: cancelledBets.length },
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id as StatusFilter)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    statusFilter === status.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status.label} {status.count > 0 && <span className="ml-1">({status.count})</span>}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="space-y-3">
          {filteredBets.length > 0 ? (
            filteredBets.map((bet) => (
              <BetCard key={bet.bookingCode} bet={bet} />
            ))
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              <History className="mx-auto mb-2 h-10 w-10" />
              <p>
                {pastBets.length === 0 ? "No bet history" : "No bets in this category"}
              </p>
              <p className="text-xs mb-4">
                {pastBets.length === 0
                  ? "Settled bets will appear here"
                  : "Check another category"}
              </p>
              {pastBets.length === 0 && (
                <Link to="/">
                  <Button size="sm" variant="outline">
                    Place a Bet
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Link to Current Bets */}
        {pastBets.length > 0 && (
          <div className="text-center pt-4">
            <Link to="/my-bets" className="text-sm text-primary hover:underline">
              View Active Bets →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BetHistory;
