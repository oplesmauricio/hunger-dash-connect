import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDeliveries, mockStats } from "@/lib/mock-data";
import { Zap, DollarSign, Star, Clock, LogOut, Bike, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const MotoboyDashboard = () => {
  const navigate = useNavigate();
  const stats = mockStats.motoboy;
  const { toast } = useToast();
  const [tab, setTab] = useState("available");

  const availableDeliveries = mockDeliveries.filter(d => d.status === 'pending');
  const myDeliveries = mockDeliveries.filter(d => d.status !== 'pending' && d.status !== 'delivered');

  const handleAccept = (id: string) => {
    toast({ title: "Entrega aceita!", description: "Dirija-se ao restaurante para coletar." });
    navigate(`/delivery/${id}`);
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
              <span className="font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>EntregaJá</span>
              <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">Motoboy</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bike className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Carlos Oliveira</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Entregas hoje", value: stats.totalDeliveries, icon: Bike, color: "text-primary" },
            { label: "Ganhos hoje", value: `R$ ${stats.todayEarnings.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Avaliação", value: `⭐ ${stats.rating}`, icon: Star, color: "text-amber-500" },
            { label: "Online", value: stats.onlineHours, icon: Clock, color: "text-blue-500" },
          ].map((stat, i) => (
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
            {availableDeliveries.map((delivery, i) => (
              <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-semibold text-foreground">{delivery.restaurantName}</span>
                        <p className="text-sm text-muted-foreground mt-0.5">{delivery.items}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">R$ {delivery.fee.toFixed(2).replace('.', ',')}</span>
                        <p className="text-xs text-muted-foreground">taxa de entrega</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{delivery.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{delivery.deliveryAddress}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>📏 {delivery.distance}</span>
                        <span>🕐 {delivery.estimatedTime}</span>
                      </div>
                      <Button size="sm" onClick={() => handleAccept(delivery.id)}>Aceitar</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-3">
            {myDeliveries.map((delivery, i) => (
              <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/delivery/${delivery.id}`)}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{delivery.restaurantName}</span>
                      <StatusBadge status={delivery.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>📍 {delivery.deliveryAddress}</span>
                      <span className="ml-4">💰 R$ {delivery.fee.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MotoboyDashboard;
