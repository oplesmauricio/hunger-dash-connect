import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NewDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState("");
  const [value, setValue] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [fee, setFee] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("deliveries").insert({
      restaurant_id: user.id,
      customer_name: customerName,
      items,
      value: parseFloat(value),
      fee: parseFloat(fee),
      pickup_address: pickupAddress,
      delivery_address: deliveryAddress,
      status: "pending" as const,
    });

    setLoading(false);

    if (error) {
      toast({ title: "Erro ao criar entrega", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Entrega publicada!", description: "Motoboys serão notificados." });
    navigate("/restaurant");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/restaurant")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-foreground text-lg" style={{ fontFamily: 'Space Grotesk' }}>Nova Entrega</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="w-5 h-5 text-primary" /> Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do cliente</Label>
                <Input placeholder="João Silva" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Itens do pedido</Label>
                <Textarea placeholder="2x Pizza Margherita, 1x Coca-Cola 2L" value={items} onChange={e => setItems(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Valor do pedido (R$)</Label>
                <Input type="number" step="0.01" placeholder="89.90" value={value} onChange={e => setValue(e.target.value)} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5 text-primary" /> Endereços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Endereço de coleta</Label>
                <Input placeholder="Rua das Flores, 123 - Centro" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Endereço de entrega</Label>
                <Input placeholder="Av. Brasil, 456 - Jardim América" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-5 h-5 text-primary" /> Taxa de entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Valor oferecido ao motoboy (R$)</Label>
                <Input type="number" step="0.50" placeholder="8.50" value={fee} onChange={e => setFee(e.target.value)} required />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/restaurant")}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Entrega"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewDelivery;
