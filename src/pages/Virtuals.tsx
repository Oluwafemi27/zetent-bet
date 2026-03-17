import Layout from "@/components/layout/Layout";
import GameCard from "@/components/GameCard";

const virtualGames = [
  { name: "Virtual Football", image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Virtual-Football", category: "Football" },
  { name: "Virtual Horse Racing", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Virtual-Horse-Racing", category: "Racing" },
  { name: "Virtual Tennis", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Virtual-Tennis", category: "Tennis" },
  { name: "Virtual Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Virtual-Basketball", category: "Basketball" },
  { name: "Virtual Dog Racing", image: "https://images.unsplash.com/photo-1558929996-da64ba858215?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Virtual-Dog-Racing", category: "Racing" },
  { name: "Virtual Motor Racing", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop", url: "https://slotcatalog.com/en/slots/Virtual-Motor-Racing", category: "Racing" },
];

const Virtuals = () => {
  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <h1 className="font-display text-2xl font-bold">Virtual Sports</h1>
        <p className="text-sm text-muted-foreground">Play virtual sports games 24/7</p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {virtualGames.map((game) => (
            <GameCard key={game.name} {...game} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Virtuals;
