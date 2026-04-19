import { PlacedBet } from "@/contexts/PlacedBetsContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface BetCardProps {
  bet: PlacedBet;
}

const BetCard = ({ bet }: BetCardProps) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      color: "bg-yellow-500/20 text-yellow-700 border-yellow-200",
      badge: "bg-yellow-500",
    },
    won: {
      icon: CheckCircle,
      label: "Won",
      color: "bg-green-500/20 text-green-700 border-green-200",
      badge: "bg-green-500",
    },
    lost: {
      icon: XCircle,
      label: "Lost",
      color: "bg-red-500/20 text-red-700 border-red-200",
      badge: "bg-red-500",
    },
    cancelled: {
      icon: AlertCircle,
      label: "Cancelled",
      color: "bg-gray-500/20 text-gray-700 border-gray-200",
      badge: "bg-gray-500",
    },
  };

  const config = statusConfig[bet.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <code className="text-sm font-bold text-primary">{bet.bookingCode}</code>
              <Badge className={`${config.badge} text-white text-[10px]`}>{config.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(bet.createdAt).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 text-right">
            <StatusIcon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Bet Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Stake</p>
            <p className="font-semibold">₦{bet.stake.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Odds</p>
            <p className="font-semibold">{bet.totalOdds.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Potential Win</p>
            <p className="font-semibold text-primary">₦{bet.potentialWin.toLocaleString()}</p>
          </div>
          {bet.status === "won" && bet.result?.wonAmount && (
            <div>
              <p className="text-muted-foreground">Won</p>
              <p className="font-semibold text-green-600">₦{bet.result.wonAmount.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Max Bet */}
        {bet.maxBet && (
          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-1">Max Bet</p>
            <p className="text-sm font-semibold">₦{bet.maxBet.toLocaleString()}</p>
          </div>
        )}

        {/* Selections */}
        <div className="border-t pt-3">
          <p className="text-xs font-semibold mb-2 text-muted-foreground">
            Selections ({bet.selections.length})
          </p>
          <div className="space-y-2">
            {bet.selections.map((selection) => (
              <div key={selection.id} className="flex items-start justify-between gap-2 p-2 bg-secondary/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs font-medium">{selection.matchName}</p>
                  <p className="text-xs text-muted-foreground">{selection.selection}</p>
                  <p className="text-xs text-muted-foreground">{selection.market}</p>
                </div>
                <p className="text-xs font-semibold shrink-0">{selection.odds.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bet Type */}
        <div className="border-t pt-3">
          <Badge variant="outline" className="text-xs">
            {bet.betType === "accumulator" ? "Accumulator Bet" : "Single Bet"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default BetCard;
