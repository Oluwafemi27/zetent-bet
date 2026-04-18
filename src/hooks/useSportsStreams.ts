import { useQuery } from "@tanstack/react-query";

export interface StreamMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  streamUrl?: string;
  teams?: {
    home?: { name: string; badge?: string };
    away?: { name: string; badge?: string };
  };
  sources?: Array<{
    source?: string;
    name?: string;
    url?: string;
    embed?: string;
    language?: string;
    quality?: string;
  }>;
}

async function fetchSportsMatches(category?: string) {
  try {
    const url = category
      ? `https://api.sportsrc.org/matches?category=${encodeURIComponent(category)}`
      : "https://api.sportsrc.org/matches";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Ensure matches have the expected shape
    const matches = Array.isArray(data.matches) ? data.matches : [];

    return matches.map((m: any) => ({
      id: m.id || m.matchId || Math.random().toString(),
      title: m.title || `${m.homeTeam} vs ${m.awayTeam}` || "Match",
      category: m.category || category || "sports",
      date: m.date ? new Date(m.date).getTime() : Date.now(),
      poster: m.poster || m.thumbnail,
      streamUrl: m.streamUrl || m.embed,
      teams: {
        home: {
          name: m.homeTeam || m.teams?.home?.name,
          badge: m.homeTeamBadge || m.teams?.home?.badge,
        },
        away: {
          name: m.awayTeam || m.teams?.away?.name,
          badge: m.awayTeamBadge || m.teams?.away?.badge,
        },
      },
      sources: m.sources || (m.streamUrl || m.embed ? [{
        url: m.streamUrl || m.embed,
        embed: m.streamUrl || m.embed,
        name: "Stream",
      }] : []),
    }));
  } catch (error) {
    console.error("Failed to fetch sports matches:", error);
    return [];
  }
}

export function useSportsStreams(category?: string) {
  return useQuery({
    queryKey: ["sportsStreams", category],
    queryFn: () => fetchSportsMatches(category),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes for live data
  });
}
