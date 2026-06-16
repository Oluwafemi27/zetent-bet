import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BoxingEvent {
  id: string;
  title: string;
  league: string;
  homeTeam?: string;
  awayTeam?: string;
  date?: string;
  time?: string;
  timestamp?: string;
  isLive?: boolean;
}

async function fetchBoxing(): Promise<BoxingEvent[]> {
  const now = new Date().toISOString();
  const future = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("matches")
    .select("id, home_team, away_team, league, start_time, status, sport")
    .in("sport", ["boxing", "mma"])
    .gte("start_time", now)
    .lte("start_time", future)
    .not("external_id", "is", null)
    .order("start_time", { ascending: true })
    .limit(30);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: `${row.home_team} vs ${row.away_team}`,
    league: row.league ?? row.sport ?? "Boxing",
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    timestamp: row.start_time,
    isLive: row.status === "live",
  }));
}

export function useBoxing(_liveOnly = false) {
  return useQuery({
    queryKey: ["boxing-supabase"],
    queryFn: fetchBoxing,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}
