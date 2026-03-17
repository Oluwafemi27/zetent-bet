import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";

interface GameCardProps {
  name: string;
  image: string;
  url: string;
  category?: string;
}

const GameCard = ({ name, image, url, category }: GameCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img src={image} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="sm" onClick={() => setOpen(true)}>
              <Play className="mr-1 h-4 w-4" /> Play Demo
            </Button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          {category && <p className="text-xs text-muted-foreground">{category}</p>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <iframe src={url} className="h-[70vh] w-full" frameBorder="0" allowFullScreen title={name} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GameCard;
