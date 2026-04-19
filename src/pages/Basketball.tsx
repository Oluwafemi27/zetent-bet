import Layout from "@/components/layout/Layout";
import MatchSkeleton from "@/components/MatchSkeleton";
import OddsButton from "@/components/OddsButton";
import { useBasketball } from "@/hooks/useBasketball";
import { formatGameDay } from "@/utils/formatGameDay";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const Basketball = () => {
  const { data: games, isLoading } = useBasketball();

  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Basketball</h1>
        </div>
        <p className="text-sm text-muted-foreground">NBA — upcoming & live games only</p>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <MatchSkeleton key={i} />)
          ) : games && games.length > 0 ? (
            games.map((g) => {
              const matchName = `${g.awayTeam} @ ${g.homeTeam}`;
              const homeOdds = 1.85;
              const awayOdds = 1.95;
              return (
                <div key={g.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{g.league}</span>
                    <div className="flex items-center gap-2">
                      {g.isLive && (
                        <Badge variant="destructive" className="animate-pulse-live text-[10px]">
                          LIVE
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {g.status || formatGameDay(g.commence_time)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {g.awayLogo && <img src={g.awayLogo} alt={g.awayTeam} className="h-8 w-8 object-contain" />}
                      <span className="text-sm font-medium truncate">{g.awayTeam}</span>
                    </div>
                    <span className="text-xs text-muted-foreground px-2">@</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-medium truncate text-right">{g.homeTeam}</span>
                      {g.homeLogo && <img src={g.homeLogo} alt={g.homeTeam} className="h-8 w-8 object-contain" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <OddsButton
                      label={g.awayAbbr || "Away"}
                      selection={{ id: `${g.id}-away`, matchName, market: "Money Line", selection: g.awayTeam, odds: awayOdds }}
                    />
                    <OddsButton
                      label={g.homeAbbr || "Home"}
                      selection={{ id: `${g.id}-home`, matchName, market: "Money Line", selection: g.homeTeam, odds: homeOdds }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              <Activity className="mx-auto mb-2 h-10 w-10" />
              <p>No upcoming basketball games</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Basketball;
