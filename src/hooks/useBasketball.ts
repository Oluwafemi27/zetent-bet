import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BasketballGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeAbbr?: string;
  awayAbbr?: string;
  league: string;
  commence_time: string;
  status?: string;
  isLive?: boolean;
}

async function fetchBasketball(): Promise<BasketballGame[]> {
  const now = new Date().toISOString();
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("matches")
    .select("id, home_team, away_team, league, start_time, status, sport")
    .eq("sport", "basketball")
    .gte("start_time", now)
    .lte("start_time", future)
    .not("external_id", "is", null)
    .order("start_time", { ascending: true })
    .limit(30);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    league: row.league ?? "Basketball",
    commence_time: row.start_time,
    isLive: row.status === "live",
    status: row.status,
  }));
}

export function useBasketball(_liveOnly = false) {
  return useQuery({
    queryKey: ["basketball-supabase"],
    queryFn: fetchBasketball,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}
