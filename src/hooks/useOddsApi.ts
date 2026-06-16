import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatGameDay } from "@/utils/formatGameDay";

const LEAGUE_FILTERS: Record<string, string | null> = {
  soccer_epl: "england",
  soccer_spain_la_liga: "laliga",
  soccer_uefa_champs_league: "champions",
  basketball_nba: null,
  all: null,
};

async function fetchMatchesFromSupabase(sportKey: string) {
  const now = new Date();
  // Show matches from now up to 30 days ahead
  const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("matches")
    .select("id, home_team, away_team, home_odds, away_odds, draw_odds, league, start_time, sport, external_id")
    .eq("status", "scheduled")
    .gte("start_time", now.toISOString())
    .lte("start_time", future)
    .not("external_id", "is", null) // only 1win synced matches
    .order("start_time", { ascending: true })
    .limit(50);

  const keyword = LEAGUE_FILTERS[sportKey];
  if (keyword) {
    query = query.ilike("league", `%${keyword}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

function mapToMatchCard(rows: any[]) {
  return rows.map((row) => ({
    id: row.id,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    // Fall back to placeholder odds if null so MatchCard still renders
    homeOdds: row.home_odds ? Number(row.home_odds) : 1.50,
    drawOdds: row.draw_odds ? Number(row.draw_odds) : 3.20,
    awayOdds: row.away_odds ? Number(row.away_odds) : 2.50,
    league: row.league ?? row.sport ?? "Football",
    time: new Date(row.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    dayLabel: formatGameDay(row.start_time),
    commence_time: row.start_time,
  }));
}

export function useOdds(sport: string, _live = false) {
  return useQuery({
    queryKey: ["matches-supabase", sport],
    queryFn: () => fetchMatchesFromSupabase(sport),
    select: (rows) => mapToMatchCard(rows),
    staleTime: 1000 * 60 * 2,
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
