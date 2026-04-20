import { supabase } from "@/integrations/supabase/client";

export type StreamTopic = "nba" | "boxing" | "soccer";

export interface LiveStreamResult {
  id: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt?: string;
  embedUrl: string;
}

export const liveStreamTopics: Array<{ id: StreamTopic; label: string; query: string }> = [
  {
    id: "nba",
    label: "NBA Basketball",
    query: "NBA basketball live",
  },
  {
    id: "soccer",
    label: "Football",
    query: "football soccer live match",
  },
  {
    id: "boxing",
    label: "Boxing",
    query: "boxing live",
  },
];

const topicQueryMap = liveStreamTopics.reduce<Record<StreamTopic, string>>((acc, topic) => {
  acc[topic.id] = topic.query;
  return acc;
}, {
  nba: "NBA basketball live",
  soccer: "football soccer live match",
  boxing: "boxing live",
});

export async function fetchLiveStreams(query: string, maxResults = 5): Promise<LiveStreamResult[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const functionUrl = import.meta.env.VITE_YOUTUBE_FUNCTION_URL || "https://wfyisqyqlijmaifunhqv.supabase.co/functions/v1/get-streams";

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: trimmedQuery,
        maxResults,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch YouTube live streams (${response.status})`);
    }

    const data = await response.json();

    if (!data?.success) {
      throw new Error(data?.error || "Failed to fetch YouTube live streams");
    }

    return Array.isArray(data.streams) ? data.streams : [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch YouTube live streams");
  }
}

export function fetchTopicStreams(topic: StreamTopic, maxResults = 5) {
  return fetchLiveStreams(topicQueryMap[topic], maxResults);
}
