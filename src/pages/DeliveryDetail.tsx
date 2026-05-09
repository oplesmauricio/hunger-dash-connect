import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, MapPin, Package, DollarSign, Clock, Bike, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DeliveryStatus = "pending" | "accepted" | "collected" | "delivered";

interface Delivery {
  id: string;
  restaurant_id: string;
  motoboy_id: string | null;
  customer_name: string;
  items: string;
  value: number;
  fee: number;
  pickup_address: string;
  delivery_address: string;
  status: DeliveryStatus;
  distance: string | null;
  estimated_time: string | null;
  created_at: string;
}

const steps: { status: DeliveryStatus; label: string; icon: typeof Package }[] = [
  { status: "pending", label: "Pendente", icon: Clock },
  { status: "accepted", label: "Aceita", icon: Bike },
  { status: "collected", label: "Coletada", icon: Package },
  { status: "delivered", label: "Entregue", icon: CheckCircle2 },
];

const statusOrder: DeliveryStatus[] = ["pending", "accepted", "collected", "delivered"];

const DeliveryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDelivery = async () => {
    const { data } = await supabase
      .from("deliveries")
      .select("*")
      .eq("id", id!)
      .single();
    setDelivery(data as Delivery | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchDelivery();

    const channel = supabase
      .channel(`delivery-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "deliveries", filter: `id=eq.${id}` }, () => {
        fetchDelivery();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Entrega não encontrada.</p>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(delivery.status);
  const isMotoboy = profile?.user_type === "motoboy";
  const isMyDelivery = delivery.motoboy_id === user?.id;

  const handleAdvance = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= statusOrder.length) return;

    const nextStatus = statusOrder[nextIndex];
    const updateData: {
      status: DeliveryStatus;
      updated_at: string;
      motoboy_id?: string;
    } = {
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    if (nextStatus === "accepted" && user?.id) {
      updateData.motoboy_id = user.id;
    }

    const { error } = await supabase
      .from("deliveries")
      .update(updateData)
      .eq("id", delivery.id);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      return;
    }

    const labels: Record<DeliveryStatus, string> = {
      pending: "", accepted: "Entrega aceita!", collected: "Pedido coletado!", delivered: "Entrega finalizada! 🎉"
    };
    toast({ title: labels[nextStatus] });
  };

  const nextLabel: Record<DeliveryStatus, string> = {
    pending: "Aceitar Entrega",
    accepted: "Confirmar Coleta",
    collected: "Confirmar Entrega",
    delivered: "",
  };

  const canAdvance = isMotoboy && (delivery.status === "pending" || isMyDelivery) && delivery.status !== "delivered";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-foreground" style={{ fontFamily: 'Space Grotesk' }}>Entrega</h1>
          </div>
          <StatusBadge status={delivery.status} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, i) => {
                const stepIndex = statusOrder.indexOf(step.status);
                const isActive = stepIndex <= currentIndex;
                return (
                  <div key={step.status} className="flex-1 flex flex-col items-center relative">
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </motion.div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        stepIndex < currentIndex ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Coleta
              </h3>
              <p className="text-sm text-muted-foreground">{delivery.pickup_address}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" /> Entrega
              </h3>
              <p className="text-sm text-foreground font-medium">{delivery.customer_name}</p>
              <p className="text-sm text-muted-foreground">{delivery.delivery_address}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-primary" /> Itens do pedido
            </h3>
            <p className="text-sm text-muted-foreground">{delivery.items}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Valor</p>
              <p className="font-bold text-foreground">R$ {Number(delivery.value).toFixed(2).replace('.', ',')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Bike className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Taxa</p>
              <p className="font-bold text-foreground">R$ {Number(delivery.fee).toFixed(2).replace('.', ',')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Distância</p>
              <p className="font-bold text-foreground">{delivery.distance || "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Tempo estimado</p>
              <p className="font-bold text-foreground">{delivery.estimated_time || "—"}</p>
            </CardContent>
          </Card>
        </div>

        {canAdvance && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button onClick={handleAdvance} size="lg" className="w-full text-base">
              {nextLabel[delivery.status]}
            </Button>
          </motion.div>
        )}

        {delivery.status === "delivered" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Space Grotesk' }}>Entrega concluída!</h2>
            <p className="text-muted-foreground">O pedido foi entregue com sucesso.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DeliveryDetail;
