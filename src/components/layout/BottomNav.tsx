import { Link, useLocation } from "react-router-dom";
import { Home, Zap, Gamepad2, Dice5, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBetSlip } from "@/contexts/BetSlipContext";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/live", icon: Zap, label: "Live" },
  { to: "/virtuals", icon: Gamepad2, label: "Virtuals" },
  { to: "/casino", icon: Dice5, label: "Casino" },
  { to: "/account", icon: UserCircle, label: "Account" },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { selections, setIsOpen } = useBetSlip();

  return (
    <>
      {selections.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/30 md:hidden"
        >
          Bet Slip ({selections.length})
        </button>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around py-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
