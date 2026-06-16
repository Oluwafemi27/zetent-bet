import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatGameDay } from "@/utils/formatGameDay";

// League slug → 1win tournament slug keyword mapping
const LEAGUE_FILTERS: Record<string, string | null> = {
  soccer_epl: "england",
  soccer_spain_la_liga: "laliga",
  soccer_uefa_champs_league: "champions",
  basketball_nba: null, // no NBA in 1win football feed
  all: null,
};

async function fetchMatchesFromSupabase(sportKey: string) {
  const now = new Date().toISOString();

  let query = supabase
    .from("matches")
    .select("id, home_team, away_team, home_odds, away_odds, draw_odds, league, start_time, sport, external_id")
    .eq("status", "scheduled")
    .gte("start_time", new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()) // include matches started up to 3h ago
    .order("start_time", { ascending: true })
    .limit(50);

  // Filter by league keyword if applicable
  const keyword = LEAGUE_FILTERS[sportKey];
  if (keyword) {
    query = query.ilike("league", `%${keyword}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

function mapToOddsFormat(rows: any[]) {
  return rows.map((row) => ({
    id: row.id,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    homeOdds: row.home_odds ? Number(row.home_odds) : 1.5,
    drawOdds: row.draw_odds ? Number(row.draw_odds) : undefined,
    awayOdds: row.away_odds ? Number(row.away_odds) : 2.5,
    league: row.league ?? row.sport ?? "Football",
    time: new Date(row.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    dayLabel: formatGameDay(row.start_time),
    // keep these for backwards compat with Index.tsx shape
    commence_time: row.start_time,
    home_team: row.home_team,
    away_team: row.away_team,
    sport_title: row.league ?? "Football",
    bookmakers: [
      {
        markets: [
          {
            outcomes: [
              { name: row.home_team, price: row.home_odds ? Number(row.home_odds) : 1.5 },
              { name: "Draw", price: row.draw_odds ? Number(row.draw_odds) : 3.5 },
              { name: row.away_team, price: row.away_odds ? Number(row.away_odds) : 2.5 },
            ],
          },
        ],
      },
    ],
  }));
}

export function useOdds(sport: string, _live = false) {
  return useQuery({
    queryKey: ["matches-supabase", sport],
    queryFn: () => fetchMatchesFromSupabase(sport),
    select: (rows) => mapToOddsFormat(rows),
    staleTime: 1000 * 60 * 2, // 2 min cache
    retry: 2,
  });
}

export function useSports() {
  return useQuery({
    queryKey: ["sports-static"],
    queryFn: async () => [
      { key: "soccer_epl", title: "EPL" },
      { key: "soccer_spain_la_liga", title: "La Liga" },
      { key: "soccer_uefa_champs_league", title: "UCL" },
    ],
    staleTime: Infinity,
  });
}
