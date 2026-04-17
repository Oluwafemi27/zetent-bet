import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE = "https://api.sportsrc.org/";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "matches"; // sports | matches | detail
    const category = url.searchParams.get("category") || "football";
    const id = url.searchParams.get("id") || "";

    let target = "";
    if (action === "sports") {
      target = `${BASE}?data=sports`;
    } else if (action === "detail") {
      if (!id) {
        return new Response(JSON.stringify({ success: false, error: "Missing id" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      target = `${BASE}?data=detail&category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`;
    } else {
      target = `${BASE}?data=matches&category=${encodeURIComponent(category)}`;
    }

    const r = await fetch(target);
    const j = await r.json();

    // For matches: filter to live or upcoming only (drop finished events)
    if (action === "matches" && j?.success && Array.isArray(j.data)) {
      const now = Date.now();
      const liveWindow = 4 * 60 * 60 * 1000; // 4h after start = still "live"
      j.data = j.data
        .filter((m: any) => typeof m.date === "number" && m.date > now - liveWindow)
        .sort((a: any, b: any) => a.date - b.date);
    }

    return new Response(JSON.stringify(j), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
