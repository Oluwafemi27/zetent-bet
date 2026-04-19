import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface PlacedBetSelection {
  id: string;
  matchName: string;
  market: string;
  selection: string;
  odds: number;
}

export interface PlacedBet {
  bookingCode: string;
  createdAt: string;
  status: "pending" | "won" | "lost" | "cancelled";
  stake: number;
  totalOdds: number;
  potentialWin: number;
  selections: PlacedBetSelection[];
  betType: "single" | "accumulator";
  maxBet?: number;
  result?: {
    wonAmount?: number;
    settledAt?: string;
  };
}

interface PlacedBetsContextType {
  placedBets: PlacedBet[];
  currentBets: PlacedBet[];
  pastBets: PlacedBet[];
  addBet: (bet: Omit<PlacedBet, "bookingCode" | "createdAt">) => PlacedBet;
  updateBetStatus: (bookingCode: string, status: PlacedBet["status"], result?: PlacedBet["result"]) => void;
  removeBet: (bookingCode: string) => void;
}

const PlacedBetsContext = createContext<PlacedBetsContextType | undefined>(undefined);

const STORAGE_KEY = "naijabet_placed_bets";

export const PlacedBetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);

  // Load bets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const bets = JSON.parse(stored) as PlacedBet[];
        setPlacedBets(bets);
      }
    } catch (error) {
      console.error("Failed to load bets from localStorage", error);
    }
  }, []);

  // Save bets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placedBets));
    } catch (error) {
      console.error("Failed to save bets to localStorage", error);
    }
  }, [placedBets]);

  const generateBookingCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const addBet = useCallback(
    (betData: Omit<PlacedBet, "bookingCode" | "createdAt">) => {
      const newBet: PlacedBet = {
        ...betData,
        bookingCode: generateBookingCode(),
        createdAt: new Date().toISOString(),
      };
      setPlacedBets((prev) => [newBet, ...prev]);
      return newBet;
    },
    []
  );

  const updateBetStatus = useCallback(
    (bookingCode: string, status: PlacedBet["status"], result?: PlacedBet["result"]) => {
      setPlacedBets((prev) =>
        prev.map((bet) =>
          bet.bookingCode === bookingCode
            ? {
                ...bet,
                status,
                result: result || bet.result,
              }
            : bet
        )
      );
    },
    []
  );

  const removeBet = useCallback((bookingCode: string) => {
    setPlacedBets((prev) => prev.filter((bet) => bet.bookingCode !== bookingCode));
  }, []);

  const currentBets = placedBets.filter((bet) => bet.status === "pending");
  const pastBets = placedBets.filter((bet) => bet.status !== "pending");

  return (
    <PlacedBetsContext.Provider
      value={{
        placedBets,
        currentBets,
        pastBets,
        addBet,
        updateBetStatus,
        removeBet,
      }}
    >
      {children}
    </PlacedBetsContext.Provider>
  );
};

export const usePlacedBets = () => {
  const ctx = useContext(PlacedBetsContext);
  if (!ctx) throw new Error("usePlacedBets must be used within PlacedBetsProvider");
  return ctx;
};
