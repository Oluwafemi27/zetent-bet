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
  const { data } = await supabase.functions.invoke("get-basketball");
  return data?.games || [];
}

export function useBasketball(liveOnly = false) {
  return useQuery({
    queryKey: ["basketball", liveOnly],
    queryFn: fetchBasketball,
    staleTime: 1000 * 60 * 2,
    refetchInterval: liveOnly ? 15000 : 1000 * 60 * 5,
    select: (games) => (liveOnly ? games.filter((g) => g.isLive) : games),
  });
}
