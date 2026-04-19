import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import OddsButton from "@/components/OddsButton";
import { useBoxing } from "@/hooks/useBoxing";
import { formatGameDayOnly } from "@/utils/formatGameDay";
import { Badge } from "@/components/ui/badge";
import { Swords } from "lucide-react";

const Boxing = () => {
  const { data: events, isLoading } = useBoxing();

  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <div className="flex items-center gap-2">
          <Swords className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Boxing</h1>
        </div>
        <p className="text-sm text-muted-foreground">Upcoming fights & live events</p>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))
          ) : events && events.length > 0 ? (
            events.map((e) => {
              const matchName = e.title || `${e.homeTeam} vs ${e.awayTeam}`;
              const homeOdds = 1.75;
              const awayOdds = 2.10;
              const dateLabel = e.timestamp
                ? formatGameDayOnly(e.timestamp)
                : `${e.date || ""} ${e.time || ""}`;
              return (
                <div key={e.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  {(e.thumb || e.poster) && (
                    <div className="relative h-32 w-full overflow-hidden bg-secondary">
                      <img src={e.thumb || e.poster} alt={matchName} className="h-full w-full object-cover" />
                      {e.isLive && (
                        <Badge variant="destructive" className="animate-pulse-live absolute top-2 right-2 text-[10px]">
                          LIVE
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">{e.league}</span>
                      <span className="text-xs text-muted-foreground">{dateLabel}</span>
                    </div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">{matchName}</h3>
                    {e.venue && <p className="mb-3 text-xs text-muted-foreground">📍 {e.venue}{e.country ? `, ${e.country}` : ""}</p>}
                    {e.homeTeam && e.awayTeam && (
                      <div className="grid grid-cols-2 gap-2">
                        <OddsButton
                          label={e.homeTeam}
                          selection={{ id: `${e.id}-home`, matchName, market: "Fight Winner", selection: e.homeTeam, odds: homeOdds }}
                        />
                        <OddsButton
                          label={e.awayTeam}
                          selection={{ id: `${e.id}-away`, matchName, market: "Fight Winner", selection: e.awayTeam, odds: awayOdds }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              <Swords className="mx-auto mb-2 h-10 w-10" />
              <p>No upcoming boxing events</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Boxing;
