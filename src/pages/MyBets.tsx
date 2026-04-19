import Layout from "@/components/layout/Layout";
import BetCard from "@/components/BetCard";
import { usePlacedBets } from "@/contexts/PlacedBetsContext";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MyBets = () => {
  const { currentBets } = usePlacedBets();

  const totalStaked = currentBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotentialWin = currentBets.reduce((sum, bet) => sum + bet.potentialWin, 0);

  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">My Bets</h1>
        </div>
        <p className="text-sm text-muted-foreground">Track your current and pending bets</p>

        {currentBets.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Total Staked</p>
              <p className="text-xl font-bold text-primary">₦{totalStaked.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Potential Win</p>
              <p className="text-xl font-bold text-green-600">₦{totalPotentialWin.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Active Bets</p>
              <p className="text-xl font-bold">{currentBets.length}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {currentBets.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold">Pending Bets ({currentBets.length})</h2>
              {currentBets.map((bet) => (
                <BetCard key={bet.bookingCode} bet={bet} />
              ))}
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              <Clock className="mx-auto mb-2 h-10 w-10" />
              <p>No active bets</p>
              <p className="text-xs mb-4">You haven't placed any bets yet</p>
              <Link to="/">
                <Button size="sm" variant="outline">
                  Place a Bet
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Link to History */}
        {currentBets.length > 0 && (
          <div className="text-center pt-4">
            <Link to="/bet-history" className="text-sm text-primary hover:underline">
              View Bet History →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBets;
