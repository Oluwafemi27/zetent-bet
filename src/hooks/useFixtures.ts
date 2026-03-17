import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchFixtures(leagueId: number) {
  const { data } = await supabase.functions.invoke("get-fixtures", {
    body: { leagueId },
  });
  return data?.fixtures || [];
}

export function useFixtures(leagueId: number) {
  return useQuery({
    queryKey: ["fixtures", leagueId],
    queryFn: () => fetchFixtures(leagueId),
    staleTime: 1000 * 60 * 5,
    enabled: leagueId > 0,
  });
}
