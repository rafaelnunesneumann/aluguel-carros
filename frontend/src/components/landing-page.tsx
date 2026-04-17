"use client";

import Link from "next/link";
import {
  Car,
  Shield,
  Zap,
  Star,
  Users,
  Building2,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/* ── Animated counter ───────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + step;
        if (next >= target) { clearInterval(timer); return target; }
        return next;
      });
    }, 24);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString("pt-BR")}{suffix}</>;
}

/* ── Main Landing Page ──────────────────────────────────── */
export function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="h-[2px] bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30 animate-glow-pulse">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold tracking-widest uppercase leading-none text-foreground">
                AutoDrive
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none mt-0.5">
                Aluguel Premium
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#for-who" className="text-muted-foreground hover:text-foreground transition-colors">Para Quem</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-lg"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="btn-shimmer hidden sm:flex text-white font-semibold">
                Cadastrar-se
              </Button>
            </Link>
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-border/40 bg-background px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>Recursos</a>
            <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>Como Funciona</a>
            <a href="#for-who" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>Para Quem</a>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Entrar</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full btn-shimmer text-white font-semibold">Cadastrar</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-speed-lines opacity-40" />

        {/* Red accent glow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 animate-hero-fade">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
                Plataforma Oficial de Locação
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2 animate-hero-fade animation-delay-100">
              <div className="divider-red w-20" />
              <h2 className="font-heading text-6xl md:text-7xl font-bold text-white leading-[0.9] tracking-tight">
                Alugue com
                <br />
                <span className="text-primary">Confiança.</span>
              </h2>
            </div>

            <p className="text-white/70 text-xl leading-relaxed max-w-lg animate-hero-fade animation-delay-200">
              Veículos premium, processo 100% digital e atendimento de excelência.
              Do pedido à entrega, tudo em um só lugar.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 animate-hero-fade animation-delay-300">
              <Link href="/register">
                <Button size="lg" className="btn-shimmer text-white font-bold px-8 h-12 text-base gap-2">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-white/40 backdrop-blur-sm h-12 px-8 text-base"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 pt-2 animate-hero-fade animation-delay-400">
              {[
                { icon: Shield, label: "Segurado" },
                { icon: Zap, label: "Aprovação Rápida" },
                { icon: Star, label: "Premium" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/60 text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <div className="h-10 w-6 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="h-1.5 w-1 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 max-w-7xl py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "Veículos Disponíveis" },
              { value: 12000, suffix: "+", label: "Clientes Atendidos" },
              { value: 98, suffix: "%", label: "Satisfação" },
              { value: 24, suffix: "h", label: "Suporte Disponível" },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="text-center space-y-1">
                <p className="font-heading text-4xl font-bold text-primary">
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <span className="text-primary text-xs font-medium tracking-widest uppercase">Diferenciais</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Por que escolher a <span className="text-primary">AutoDrive</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Uma plataforma completa que conecta clientes, empresa e banco em um processo transparente e eficiente.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Frota Premium",
                desc: "Veículos selecionados e revisados, das melhores marcas e modelos do mercado.",
                highlight: true,
              },
              {
                icon: Shield,
                title: "Processo Seguro",
                desc: "Análise de crédito integrada com validação bancária para sua total segurança.",
                highlight: false,
              },
              {
                icon: Zap,
                title: "100% Digital",
                desc: "Solicite, acompanhe e gerencie todo o seu aluguel sem sair de casa.",
                highlight: false,
              },
              {
                icon: Clock,
                title: "Resposta Ágil",
                desc: "Avaliação de pedidos em tempo real com notificações de status instantâneas.",
                highlight: false,
              },
              {
                icon: Award,
                title: "Excelência Garantida",
                desc: "Atendimento personalizado e suporte dedicado durante todo o período do contrato.",
                highlight: false,
              },
              {
                icon: MapPin,
                title: "Ampla Cobertura",
                desc: "Presença em múltiplas cidades com opções de entrega e retirada flexíveis.",
                highlight: false,
              },
            ].map(({ icon: Icon, title, desc, highlight }) => (
              <div
                key={title}
                className={`card-automotive group rounded-xl border p-6 space-y-4 transition-all ${
                  highlight
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border hover:border-primary/20"
                }`}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${
                  highlight ? "bg-primary text-white" : "bg-secondary text-primary"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold tracking-wide">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  highlight ? "text-primary" : "text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                }`}>
                  <span>Saiba mais</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-speed-lines opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="text-primary text-xs font-medium tracking-widest uppercase">Processo</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight">
              Como <span className="text-primary">Funciona</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Simples, transparente e totalmente digital. Em apenas 4 passos.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />

            {[
              {
                step: "01",
                icon: Users,
                title: "Cadastro",
                desc: "Crie sua conta gratuitamente e complete seu perfil em minutos.",
              },
              {
                step: "02",
                icon: Car,
                title: "Solicite",
                desc: "Escolha o veículo e envie seu pedido de aluguel com todos os detalhes.",
              },
              {
                step: "03",
                icon: CreditCard,
                title: "Análise",
                desc: "Empresa e banco avaliam sua solicitação e liberam o crédito necessário.",
              },
              {
                step: "04",
                icon: CheckCircle,
                title: "Aprovado!",
                desc: "Pedido aprovado, contrato gerado e veículo disponível para retirada.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center space-y-4">
                {/* Step circle */}
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{step}</span>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-white tracking-wide">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed max-w-48">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Who ────────────────────────────────────── */}
      <section id="for-who" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <span className="text-primary text-xs font-medium tracking-widest uppercase">Plataforma</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Uma plataforma para <span className="text-primary">todos</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              O AutoDrive conecta três perfis em um ecossistema único e eficiente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cliente */}
            <div className="group relative rounded-2xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 transition-all duration-300 p-8 space-y-6 hover:-translate-y-1">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/20">
                <Users className="h-7 w-7 text-sky-400" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-sky-400">Cliente</span>
                <h3 className="font-heading text-2xl font-bold mt-1 tracking-wide">Para Você</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Cadastre-se e autentique-se facilmente",
                  "Solicite aluguel do veículo ideal",
                  "Modifique ou cancele seu pedido",
                  "Acompanhe o status em tempo real",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" size="sm" className="w-full border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/50 gap-2">
                  Sou Cliente
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Empresa — destaque */}
            <div className="group relative rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 p-8 space-y-6 hover:-translate-y-1 md:-translate-y-3">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Principal</span>
              </div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-primary">Empresa</span>
                <h3 className="font-heading text-2xl font-bold mt-1 tracking-wide">Para Gestores</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Gerencie toda a frota de veículos",
                  "Avalie e aprove pedidos de aluguel",
                  "Ajuste informações contratuais",
                  "Dashboard completo de gestão",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="sm" className="w-full btn-shimmer text-white font-semibold gap-2">
                  Sou Gestor
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Banco */}
            <div className="group relative rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all duration-300 p-8 space-y-6 hover:-translate-y-1">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                <CreditCard className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">Banco</span>
                <h3 className="font-heading text-2xl font-bold mt-1 tracking-wide">Para Financeiras</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Avalie a viabilidade financeira",
                  "Conceda crédito ao cliente",
                  "Gerencie dados financeiros do pedido",
                  "Integração segura e automatizada",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" size="sm" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 gap-2">
                  Sou do Banco
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials / Trust section ───────────────── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading text-4xl font-bold tracking-tight">
              Confiado por <span className="text-primary">milhares</span> de clientes
            </h2>
            <p className="text-muted-foreground text-lg">O que dizem quem já dirige com a AutoDrive.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Processo incrivelmente simples. Solicitei o aluguel, tive aprovação em horas e o carro foi entregrado no mesmo dia.",
                name: "Carlos Mendes",
                role: "Cliente",
                stars: 5,
              },
              {
                quote: "A plataforma revolucionou nossa gestão de frota. Temos controle total dos pedidos e contratos em tempo real.",
                name: "Ana Paula Silva",
                role: "Gestora de Frotas",
                stars: 5,
              },
              {
                quote: "A integração bancária é perfeita. Análise de crédito automatizada e segura, do jeito que precisa ser.",
                name: "Roberto Santos",
                role: "Analista Financeiro",
                stars: 5,
              },
            ].map(({ quote, name, role, stars }) => (
              <div key={name} className="card-automotive rounded-xl border border-border bg-background p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center space-y-8">
          <div className="space-y-2">
            <div className="divider-red w-16 mx-auto" />
            <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tight">
              Pronto para <span className="text-primary">dirigir?</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-xl max-w-lg mx-auto">
            Cadastre-se gratuitamente e tenha acesso à frota premium da AutoDrive hoje mesmo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="btn-shimmer text-white font-bold px-10 h-14 text-lg gap-2">
                Criar Conta Grátis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            Sem taxas de cadastro · Sem compromisso · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="font-heading text-lg font-bold tracking-widest uppercase">AutoDrive</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Plataforma profissional de locação de automóveis. Conectando clientes, empresas e instituições financeiras.
              </p>
              <div className="flex gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5" />
                  <span>contato@autodrive.com.br</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Phone className="h-3.5 w-3.5" />
                  <span>(11) 9 0000-0000</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h4 className="font-heading font-semibold tracking-widest uppercase text-sm">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">Como Funciona</a></li>
                <li><a href="#for-who" className="hover:text-foreground transition-colors">Para Quem</a></li>
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-3">
              <h4 className="font-heading font-semibold tracking-widest uppercase text-sm">Acesso</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">Entrar na Conta</Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground transition-colors">Criar Cadastro</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} AutoDrive. Todos os direitos reservados.</p>
            <p className="text-primary font-medium tracking-wide">Aluguel de Veículos Premium</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
