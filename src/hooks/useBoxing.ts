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
  thumb?: string;
  poster?: string;
  venue?: string;
  country?: string;
  isLive?: boolean;
}

async function fetchBoxing(): Promise<BoxingEvent[]> {
  const { data } = await supabase.functions.invoke("get-boxing");
  return data?.events || [];
}

export function useBoxing(liveOnly = false) {
  return useQuery({
    queryKey: ["boxing", liveOnly],
    queryFn: fetchBoxing,
    staleTime: 1000 * 60 * 10,
    refetchInterval: liveOnly ? 30000 : undefined,
    select: (events) => (liveOnly ? events.filter((e) => e.isLive) : events),
  });
}
