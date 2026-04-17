import Layout from "@/components/layout/Layout";
import { Tv } from "lucide-react";

const WatchLive = () => {
  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <div className="flex items-center gap-2">
          <Tv className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Watch Live</h1>
        </div>
        <p className="text-sm text-muted-foreground">Stream live games right inside the app</p>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src="https://sportplus.live/"
              title="Sportplus Live"
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Streams provided by sportplus.live. If a stream doesn't load, the provider may have blocked iframe embedding —{" "}
          <a href="https://sportplus.live/" target="_blank" rel="noreferrer" className="text-primary underline">
            open in a new tab
          </a>.
        </p>
      </div>
    </Layout>
  );
};

export default WatchLive;
