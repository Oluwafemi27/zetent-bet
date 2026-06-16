import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatGameDay } from "@/utils/formatGameDay";

// Map tab keys to 1win tournament slug keywords
const LEAGUE_FILTERS: Record<string, string | null> = {
  all: null,
  soccer_epl: "premier-league",
  soccer_spain_la_liga: "laliga",
  soccer_uefa_champs_league: "champions-league",
  basketball_nba: null, // NBA handled by useBasketball
};

async function fetchMatchesFromSupabase(sportKey: string) {
  const now = new Date().toISOString();
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("matches")
    .select("id, home_team, away_team, home_odds, away_odds, draw_odds, league, start_time, sport, external_id, status")
    .eq("sport", "soccer")
    .in("status", ["scheduled", "live"])
    .gte("start_time", now)
    .lte("start_time", future)
    .not("external_id", "is", null)
    .order("start_time", { ascending: true })
    .limit(100);

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
    homeOdds: row.home_odds ? Number(row.home_odds) : 1.50,
    drawOdds: row.draw_odds !== null ? Number(row.draw_odds) : 3.20,
    awayOdds: row.away_odds ? Number(row.away_odds) : 2.50,
    league: row.league ?? "Football",
    time: new Date(row.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    dayLabel: formatGameDay(row.start_time),
    commence_time: row.start_time,
    isLive: row.status === "live",
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
