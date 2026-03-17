import React, { createContext, useContext, useState, useCallback } from "react";

export interface BetSelection {
  id: string;
  matchName: string;
  market: string;
  selection: string;
  odds: number;
}

interface BetSlipContextType {
  selections: BetSelection[];
  addSelection: (sel: BetSelection) => void;
  removeSelection: (id: string) => void;
  clearSlip: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  stake: number;
  setStake: (v: number) => void;
  totalOdds: number;
  potentialWin: number;
  betType: "single" | "accumulator";
  setBetType: (v: "single" | "accumulator") => void;
}

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export const BetSlipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stake, setStake] = useState(100);
  const [betType, setBetType] = useState<"single" | "accumulator">("single");

  const addSelection = useCallback((sel: BetSelection) => {
    setSelections((prev) => {
      if (prev.length >= 15) return prev;
      const exists = prev.find((s) => s.id === sel.id);
      if (exists) return prev.filter((s) => s.id !== sel.id);
      return [...prev, sel];
    });
    setIsOpen(true);
  }, []);

  const removeSelection = useCallback((id: string) => {
    setSelections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearSlip = useCallback(() => {
    setSelections([]);
    setStake(100);
  }, []);

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const potentialWin = stake * totalOdds;

  return (
    <BetSlipContext.Provider
      value={{ selections, addSelection, removeSelection, clearSlip, isOpen, setIsOpen, stake, setStake, totalOdds, potentialWin, betType, setBetType }}
    >
      {children}
    </BetSlipContext.Provider>
  );
};

export const useBetSlip = () => {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used within BetSlipProvider");
  return ctx;
};
