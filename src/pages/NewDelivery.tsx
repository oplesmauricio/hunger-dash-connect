import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Entrega publicada!", description: "Motoboys serão notificados." });
      navigate("/restaurant");
    }, 800);
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
                <Input placeholder="João Silva" required />
              </div>
              <div className="space-y-2">
                <Label>Itens do pedido</Label>
                <Textarea placeholder="2x Pizza Margherita, 1x Coca-Cola 2L" required />
              </div>
              <div className="space-y-2">
                <Label>Valor do pedido (R$)</Label>
                <Input type="number" step="0.01" placeholder="89.90" required />
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
                <Input placeholder="Rua das Flores, 123 - Centro" required />
              </div>
              <div className="space-y-2">
                <Label>Endereço de entrega</Label>
                <Input placeholder="Av. Brasil, 456 - Jardim América" required />
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
                <Input type="number" step="0.50" placeholder="8.50" required />
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
