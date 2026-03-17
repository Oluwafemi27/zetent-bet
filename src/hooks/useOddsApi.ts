import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ODDS_BASE = "https://api.the-odds-api.com/v4";

async function fetchWithKey(path: string) {
  // Fetch key from edge function to avoid exposing it
  const { data } = await supabase.functions.invoke("get-api-keys");
  const apiKey = data?.oddsApiKey;
  if (!apiKey) throw new Error("Odds API key not configured");
  
  const res = await fetch(`${ODDS_BASE}${path}&apiKey=${apiKey}`);
  if (!res.ok) throw new Error(`Odds API error: ${res.status}`);
  return res.json();
}

export function useSports() {
  return useQuery({
    queryKey: ["odds-sports"],
    queryFn: () => fetchWithKey("/sports?all=false"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useOdds(sport: string, live = false) {
  return useQuery({
    queryKey: ["odds", sport, live],
    queryFn: () =>
      fetchWithKey(
        `/sports/${sport}/odds?regions=eu&markets=h2h&oddsFormat=decimal${live ? "&eventIds=" : ""}`
      ),
    refetchInterval: live ? 10000 : undefined,
    enabled: !!sport,
  });
}
