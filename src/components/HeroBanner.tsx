import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Welcome Bonus",
    subtitle: "Get ₦500 FREE on signup!",
    gradient: "from-primary/80 to-primary/40",
  },
  {
    title: "Live Betting",
    subtitle: "Bet on matches happening right now",
    gradient: "from-naija-live/80 to-naija-live/40",
  },
  {
    title: "Aviator Crash Game",
    subtitle: "Fly high, cash out before it crashes!",
    gradient: "from-naija-gold/80 to-naija-gold/40",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-r ${slides[current].gradient} rounded-xl p-6 md:p-10`}
        >
          <h2 className="font-display text-2xl font-bold text-foreground md:text-4xl">{slides[current].title}</h2>
          <p className="mt-2 text-sm text-foreground/80 md:text-base">{slides[current].subtitle}</p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("h-1.5 rounded-full transition-all", i === current ? "w-6 bg-foreground" : "w-1.5 bg-foreground/40")}
          />
        ))}
      </div>

      <button onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-1 text-foreground">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => setCurrent((p) => (p + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-1 text-foreground">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

// Need cn import
import { cn } from "@/lib/utils";

export default HeroBanner;
