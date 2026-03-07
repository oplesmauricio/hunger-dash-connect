import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bike, Store, Zap, MapPin, Clock, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              EntregaJá
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Começar agora</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Entregas rápidas e confiáveis
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                Conecte seu restaurante aos
                <span className="text-primary"> melhores motoboys</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Plataforma que conecta restaurantes a motoboys autônomos para entregas rápidas, seguras e com o melhor custo-benefício.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup?type=restaurant">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
                    <Store className="w-5 h-5" />
                    Sou Restaurante
                  </Button>
                </Link>
                <Link to="/signup?type=motoboy">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base px-8">
                    <Bike className="w-5 h-5" />
                    Sou Motoboy
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl rotate-3" />
                <div className="absolute inset-0 bg-card rounded-3xl shadow-2xl border border-border p-8 flex flex-col justify-center">
                  {/* Mock delivery card */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Pizzaria Bella Napoli</p>
                        <p className="text-sm text-muted-foreground">Nova entrega • R$ 8,50</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-6 border-l-2 border-dashed border-primary/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary -ml-[calc(0.25rem+1px)]" />
                        <span className="text-sm text-muted-foreground">Rua das Flores, 123</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent -ml-[calc(0.25rem+1px)]" />
                        <span className="text-sm text-muted-foreground">Av. Brasil, 456</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">Distância</p>
                        <p className="font-semibold text-foreground">3.2 km</p>
                      </div>
                      <div className="flex-1 bg-muted rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">Tempo est.</p>
                        <p className="font-semibold text-foreground">15 min</p>
                      </div>
                    </div>
                    <Button className="w-full">Aceitar Entrega</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Por que escolher a EntregaJá?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tecnologia simples e eficiente para conectar quem precisa entregar com quem quer entregar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Entregas em minutos", desc: "Motoboys próximos recebem suas entregas instantaneamente." },
              { icon: MapPin, title: "Rastreamento em tempo real", desc: "Acompanhe cada entrega do restaurante até o cliente." },
              { icon: Shield, title: "Seguro e confiável", desc: "Motoboys verificados e avaliados pela comunidade." },
              { icon: Clock, title: "Disponível 24/7", desc: "Entregas a qualquer hora do dia ou da noite." },
              { icon: Store, title: "Painel completo", desc: "Dashboard intuitivo para gerenciar todas as entregas." },
              { icon: Bike, title: "Ganhos flexíveis", desc: "Motoboys escolhem quando e quanto querem trabalhar." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-12 text-primary-foreground"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Pronto para começar?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Cadastre-se gratuitamente e comece a usar em menos de 5 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup?type=restaurant">
                <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
                  <Store className="w-5 h-5" />
                  Cadastrar Restaurante
                </Button>
              </Link>
              <Link to="/signup?type=motoboy">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Bike className="w-5 h-5" />
                  Cadastrar Motoboy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">EntregaJá</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 EntregaJá. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
