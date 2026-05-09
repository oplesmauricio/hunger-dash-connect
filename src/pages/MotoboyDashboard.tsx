import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Zap, DollarSign, Star, Clock, LogOut, Bike, MapPin, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  restaurant_id: string;
  customer_name: string;
  items: string;
  value: number;
  fee: number;
  pickup_address: string;
  delivery_address: string;
  status: "pending" | "accepted" | "collected" | "delivered";
  distance: string | null;
  estimated_time: string | null;
  motoboy_id: string | null;
  created_at: string;
  restaurant_profile?: { name: string } | null;
}

const MotoboyDashboard = () => {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("available");
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    // Motoboy sees: pending deliveries + their own accepted/collected
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
      .channel("motoboy-deliveries")
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const availableDeliveries = deliveries.filter(d => d.status === "pending");
  const myDeliveries = deliveries.filter(d => d.motoboy_id === user?.id && d.status !== "delivered");
  const todayEarnings = deliveries
    .filter(d => d.motoboy_id === user?.id && d.status === "delivered" && new Date(d.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, d) => sum + Number(d.fee), 0);

  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from("deliveries")
      .update({ motoboy_id: user?.id, status: "accepted" as const, updated_at: new Date().toISOString() })
      .eq("id", id);
    
    if (error) {
      toast({ title: "Erro ao aceitar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Entrega aceita!", description: "Dirija-se ao local de coleta para coletar." });
    navigate(`/delivery/${id}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const stats = [
    { label: "Entregas hoje", value: myDeliveries.length, icon: Bike, color: "text-primary" },
    { label: "Ganhos hoje", value: `R$ ${todayEarnings.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: "text-emerald-500" },
    { label: "Avaliação", value: `⭐ ${profile?.rating || "—"}`, icon: Star, color: "text-amber-500" },
    { label: "Online", value: "—", icon: Clock, color: "text-blue-500" },
  ];

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
              <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">Entregador</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bike className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{profile?.name || "Entregador"}</span>
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

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="available">Disponíveis ({availableDeliveries.length})</TabsTrigger>
            <TabsTrigger value="active">Minhas Entregas ({myDeliveries.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : availableDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Nenhuma entrega disponível</h3>
                  <p className="text-muted-foreground">Aguarde novas entregas serem publicadas.</p>
                </CardContent>
              </Card>
            ) : (
              availableDeliveries.map((delivery, i) => (
                <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-semibold text-foreground">{delivery.customer_name}</span>
                          <p className="text-sm text-muted-foreground mt-0.5">{delivery.items}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">R$ {Number(delivery.fee).toFixed(2).replace('.', ',')}</span>
                          <p className="text-xs text-muted-foreground">taxa de entrega</p>
                        </div>
                      </div>
                      <div className="space-y-1 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{delivery.pickup_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          <span>{delivery.delivery_address}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {delivery.distance && <span>📏 {delivery.distance}</span>}
                          {delivery.estimated_time && <span>🕐 {delivery.estimated_time}</span>}
                        </div>
                        <Button size="sm" onClick={() => handleAccept(delivery.id)}>Aceitar</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-3">
            {myDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bike className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Nenhuma entrega ativa</h3>
                  <p className="text-muted-foreground">Aceite uma entrega para começar.</p>
                </CardContent>
              </Card>
            ) : (
              myDeliveries.map((delivery, i) => (
                <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/delivery/${delivery.id}`)}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{delivery.customer_name}</span>
                        <StatusBadge status={delivery.status} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>📍 {delivery.delivery_address}</span>
                        <span className="ml-4">💰 R$ {Number(delivery.fee).toFixed(2).replace('.', ',')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MotoboyDashboard;
