import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDeliveries, mockStats } from "@/lib/mock-data";
import { Zap, Plus, Package, TrendingUp, Clock, LogOut, Store } from "lucide-react";

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const stats = mockStats.restaurant;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>EntregaJá</span>
              <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">Restaurante</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Pizzaria Bella Napoli</span>
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
            { label: "Entregas hoje", value: stats.totalDeliveries, icon: Package, color: "text-primary" },
            { label: "Em andamento", value: stats.activeDeliveries, icon: Clock, color: "text-blue-500" },
            { label: "Receita hoje", value: `R$ ${stats.todayRevenue.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: "text-emerald-500" },
            { label: "Tempo médio", value: stats.avgDeliveryTime, icon: Clock, color: "text-amber-500" },
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

        {/* Actions + List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>Entregas recentes</h2>
          <Link to="/restaurant/new-delivery">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nova Entrega
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {mockDeliveries.map((delivery, i) => (
            <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/delivery/${delivery.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{delivery.customerName}</span>
                      <StatusBadge status={delivery.status} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">R$ {delivery.value.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>📍 {delivery.deliveryAddress}</span>
                    <span>🕐 {delivery.estimatedTime}</span>
                    {delivery.motoboyName && <span>🏍️ {delivery.motoboyName}</span>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard;
