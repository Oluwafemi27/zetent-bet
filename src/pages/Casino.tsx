import Layout from "@/components/layout/Layout";
import GameCard from "@/components/GameCard";

const casinoGames = [
  { name: "Sweet Bonanza", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Sweet-Bonanza", category: "Slots" },
  { name: "Gates of Olympus", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Gates-of-Olympus", category: "Slots" },
  { name: "Big Bass Bonanza", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Big-Bass-Bonanza", category: "Slots" },
  { name: "Spaceman", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Spaceman", category: "Crash" },
  { name: "Book of Dead", image: "https://images.unsplash.com/photo-1553729459-afe8f2e2882d?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Book-of-Dead", category: "Slots" },
  { name: "Starburst", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Starburst", category: "Slots" },
];

const Casino = () => {
  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <h1 className="font-display text-2xl font-bold">Casino</h1>
        <p className="text-sm text-muted-foreground">Try free demo slots — no real money required</p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {casinoGames.map((game) => (
            <GameCard key={game.name} {...game} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Casino;
