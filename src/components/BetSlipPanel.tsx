import { useBetSlip } from "@/contexts/BetSlipContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const BetSlipPanel = () => {
  const { selections, removeSelection, clearSlip, stake, setStake, totalOdds, potentialWin, isOpen, setIsOpen } = useBetSlip();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [placing, setPlacing] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [loadCode, setLoadCode] = useState("");

  const placeBet = async () => {
    if (!user || !profile) {
      toast({ title: "Please login first", variant: "destructive" });
      return;
    }
    if (stake <= 0) {
      toast({ title: "Enter a valid stake", variant: "destructive" });
      return;
    }
    if (stake > profile.balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }
    setPlacing(true);
    try {
      const { data, error } = await supabase.from("bets").insert({
        user_id: user.id,
        selections: selections as any,
        stake,
        potential_win: potentialWin,
        status: "pending",
      }).select().single();

      if (error) throw error;

      await supabase.from("profiles").update({ balance: profile.balance - stake }).eq("id", user.id);
      await refreshProfile();

      setBookingCode(data.booking_code || "");
      toast({ title: "Bet placed successfully! 🎉" });
      clearSlip();
    } catch (err: any) {
      toast({ title: "Error placing bet", description: err.message, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  const loadBookingCode = async () => {
    if (!loadCode) return;
    try {
      const { data } = await supabase.from("bets").select("selections").eq("booking_code", loadCode.toUpperCase()).single();
      if (data?.selections) {
        toast({ title: "Selections loaded!" });
      } else {
        toast({ title: "Invalid booking code", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error loading booking code", description: err.message, variant: "destructive" });
    }
  };

  // Desktop side panel
  const desktopContent = (
    <div className="hidden md:flex md:w-80 md:flex-col md:border-l md:border-border md:bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-display text-lg font-bold">Bet Slip</h3>
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">{selections.length}</span>
      </div>
      <SlipContent
        selections={selections}
        removeSelection={removeSelection}
        clearSlip={clearSlip}
        stake={stake}
        setStake={setStake}
        totalOdds={totalOdds}
        potentialWin={potentialWin}
        placeBet={placeBet}
        placing={placing}
        bookingCode={bookingCode}
      />
    </div>
  );

  // Mobile sheet
  const mobileSheet = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl border-t border-border bg-card p-0 md:hidden">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border p-4">
          <SheetTitle className="font-display text-lg">Bet Slip ({selections.length})</SheetTitle>
        </SheetHeader>
        <SlipContent
          selections={selections}
          removeSelection={removeSelection}
          clearSlip={clearSlip}
          stake={stake}
          setStake={setStake}
          totalOdds={totalOdds}
          potentialWin={potentialWin}
          placeBet={placeBet}
          placing={placing}
          bookingCode={bookingCode}
        />
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {desktopContent}
      {mobileSheet}
    </>
  );
};

function SlipContent({
  selections, removeSelection, clearSlip, stake, setStake, totalOdds, potentialWin, placeBet, placing, bookingCode,
}: any) {
  if (selections.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-muted-foreground">
        <Ticket className="h-12 w-12" />
        <p className="text-center text-sm">Click on any odds to add selections to your bet slip</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {selections.map((sel: any) => (
          <div key={sel.id} className="rounded-lg bg-secondary p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{sel.matchName}</p>
                <p className="text-sm font-medium text-foreground">{sel.selection}</p>
                <p className="text-xs text-muted-foreground">{sel.market}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/20 px-2 py-0.5 text-sm font-bold text-primary">{sel.odds.toFixed(2)}</span>
                <button onClick={() => removeSelection(sel.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Odds</span>
          <span className="font-bold text-primary">{totalOdds.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Stake ₦</span>
          <Input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="bg-secondary text-right"
            min={1}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Potential Win</span>
          <span className="text-lg font-bold text-primary">₦{potentialWin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {bookingCode && (
          <div className="rounded-lg bg-primary/10 p-2 text-center">
            <p className="text-xs text-muted-foreground">Booking Code</p>
            <p className="font-display text-lg font-bold text-primary">{bookingCode}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearSlip} className="flex-1">
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
          <Button onClick={placeBet} disabled={placing} className="flex-1">
            {placing ? "Placing..." : "Place Bet"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BetSlipPanel;
