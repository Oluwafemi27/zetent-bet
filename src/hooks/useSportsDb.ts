import { useQuery } from "@tanstack/react-query";

const BASE = "https://www.thesportsdb.com/api/v1/json/3";

async function searchTeam(name: string) {
  const res = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(name)}`);
  const data = await res.json();
  return data?.teams?.[0] || null;
}

export function useTeamBadge(teamName: string) {
  return useQuery({
    queryKey: ["team-badge", teamName],
    queryFn: () => searchTeam(teamName),
    staleTime: 1000 * 60 * 60,
    enabled: !!teamName,
  });
}
