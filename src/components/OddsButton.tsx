import { cn } from "@/lib/utils";
import { useBetSlip, type BetSelection } from "@/contexts/BetSlipContext";

interface OddsButtonProps {
  selection: BetSelection;
  label?: string;
}

const OddsButton = ({ selection, label }: OddsButtonProps) => {
  const { selections, addSelection } = useBetSlip();
  const isSelected = selections.some((s) => s.id === selection.id);

  return (
    <button
      onClick={() => addSelection(selection)}
      className={cn(
        "flex flex-col items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
        isSelected
          ? "border-primary bg-primary/20 text-primary"
          : "border-border bg-secondary text-foreground hover:border-primary/50 hover:bg-secondary/80"
      )}
    >
      {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
      <span>{selection.odds.toFixed(2)}</span>
    </button>
  );
};

export default OddsButton;
