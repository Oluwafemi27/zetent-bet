import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, DollarSign, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const defaultPromos = [
  { id: "1", title: "Welcome Bonus", description: "Get ₦500 FREE on your first registration! Start betting with no deposit.", icon: Gift, color: "from-primary/30 to-primary/10" },
  { id: "2", title: "Free Bet Friday", description: "Place 5 bets during the week and get a ₦200 free bet every Friday!", icon: DollarSign, color: "from-naija-gold/30 to-naija-gold/10" },
  { id: "3", title: "10% Cashback", description: "Get 10% cashback on all losing bets every Monday. Max ₦5,000.", icon: RotateCcw, color: "from-destructive/30 to-destructive/10" },
];

const Promotions = () => {
  const { data: promos, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data } = await supabase.from("promotions").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const displayPromos = promos && promos.length > 0 ? promos : null;

  return (
    <Layout>
      <div className="container space-y-4 py-4">
        <h1 className="font-display text-2xl font-bold">Promotions</h1>
        <p className="text-sm text-muted-foreground">Grab the best offers and bonuses</p>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayPromos
              ? displayPromos.map((p) => (
                  <Card key={p.id} className="overflow-hidden">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="h-40 w-full object-cover" />}
                    <CardContent className="p-4">
                      <h3 className="font-display text-lg font-bold">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                    </CardContent>
                  </Card>
                ))
              : defaultPromos.map((p) => (
                  <Card key={p.id} className={`bg-gradient-to-r ${p.color} border-border`}>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="rounded-xl bg-card p-3">
                        <p.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                        <Button size="sm" className="mt-3">Claim Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Promotions;
