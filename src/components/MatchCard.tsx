import OddsButton from "./OddsButton";
import { Badge } from "@/components/ui/badge";

interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  league?: string;
  isLive?: boolean;
  time?: string;
  dayLabel?: string;
}

const MatchCard = ({ id, homeTeam, awayTeam, homeLogo, awayLogo, homeOdds, drawOdds, awayOdds, league, isLive, time, dayLabel }: MatchCardProps) => {
  const matchName = `${homeTeam} vs ${awayTeam}`;

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{league}</span>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="destructive" className="animate-pulse-live text-[10px]">
              LIVE
            </Badge>
          )}
          {dayLabel && <span className="text-xs text-muted-foreground">{dayLabel}</span>}
          {!dayLabel && time && <span className="text-xs text-muted-foreground">{time}</span>}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {homeLogo && <img src={homeLogo} alt={homeTeam} className="h-6 w-6 rounded-full object-cover" />}
          <span className="text-sm font-medium text-foreground truncate">{homeTeam}</span>
        </div>
        <span className="text-xs text-muted-foreground px-2">vs</span>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-medium text-foreground truncate text-right">{awayTeam}</span>
          {awayLogo && <img src={awayLogo} alt={awayTeam} className="h-6 w-6 rounded-full object-cover" />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <OddsButton
          label="1"
          selection={{ id: `${id}-home`, matchName, market: "Match Winner", selection: homeTeam, odds: homeOdds }}
        />
        <OddsButton
          label="X"
          selection={{ id: `${id}-draw`, matchName, market: "Match Winner", selection: "Draw", odds: drawOdds }}
        />
        <OddsButton
          label="2"
          selection={{ id: `${id}-away`, matchName, market: "Match Winner", selection: awayTeam, odds: awayOdds }}
        />
      </div>
    </div>
  );
};

export default MatchCard;
