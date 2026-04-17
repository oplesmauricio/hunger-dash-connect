import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Plus, Package, TrendingUp, Clock, LogOut, Store } from "lucide-react";

interface Delivery {
  id: string;
  customer_name: string;
  delivery_address: string;
  value: number;
  fee: number;
  status: "pending" | "accepted" | "collected" | "delivered";
  estimated_time: string | null;
  motoboy_id: string | null;
  created_at: string;
  motoboy_profile?: { name: string } | null;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    const { data } = await supabase
      .from("deliveries")
      .select("*")
      .order("created_at", { ascending: false });
    setDeliveries((data as Delivery[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveries();

    const channel = supabase
      .channel("restaurant-deliveries")
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const activeCount = deliveries.filter(d => d.status !== "delivered").length;
  const todayRevenue = deliveries
    .filter(d => new Date(d.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, d) => sum + Number(d.value), 0);

  const stats = [
    { label: "Entregas hoje", value: deliveries.length, icon: Package, color: "text-primary" },
    { label: "Em andamento", value: activeCount, icon: Clock, color: "text-blue-500" },
    { label: "Receita hoje", value: `R$ ${todayRevenue.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Tempo médio", value: "—", icon: Clock, color: "text-amber-500" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>Motiggo</span>
              <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">Restaurante</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{profile?.name || "Restaurante"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>Entregas recentes</h2>
          <Link to="/restaurant/new-delivery">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nova Entrega
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : deliveries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Nenhuma entrega ainda</h3>
              <p className="text-muted-foreground mb-4">Crie sua primeira entrega para começar.</p>
              <Link to="/restaurant/new-delivery">
                <Button className="gap-2"><Plus className="w-4 h-4" /> Nova Entrega</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery, i) => (
              <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/delivery/${delivery.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">{delivery.customer_name}</span>
                        <StatusBadge status={delivery.status} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">R$ {Number(delivery.value).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📍 {delivery.delivery_address}</span>
                      {delivery.estimated_time && <span>🕐 {delivery.estimated_time}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantDashboard;
