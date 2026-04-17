"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCliente } from "@/services/authService";
import { onlyDigits, maskCpf, maskPhone } from "@/lib/formatters";

const schema = z
  .object({
    nome: z.string().min(3, "Mínimo 3 caracteres").max(150),
    cpf: z.string().refine((v) => onlyDigits(v).length === 11, "CPF deve ter 11 dígitos"),
    rg: z.string().min(1, "RG é obrigatório").max(20),
    endereco: z.string().min(1, "Endereço é obrigatório").max(255),
    profissao: z.string().max(100).optional(),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    telefone: z.string().max(20).optional(),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    confirmSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.senha === d.confirmSenha, {
    message: "Senhas não conferem",
    path: ["confirmSenha"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  onBack: () => void;
}

export default function RegisterClienteForm({ onBack }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await registerCliente({
        ...data,
        cpf: onlyDigits(data.cpf),
        telefone: data.telefone ? onlyDigits(data.telefone) : undefined,
      });
      toast.success("Conta criada com sucesso! Faça login.");
      router.push("/login");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao criar conta";
      toast.error(msg);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" /> Voltar
      </button>

      <div className="mb-6">
        <div className="divider-red w-10 mb-4" />
        <h2 className="font-heading text-3xl font-bold tracking-wide">Cadastro de Cliente</h2>
        <p className="text-muted-foreground text-sm mt-1">Preencha seus dados para criar uma conta</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="nome" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome completo *
            </Label>
            <Input id="nome" className="h-10 bg-card border-border/60" {...register("nome")} />
            {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cpf" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CPF *
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              className="h-10 bg-card border-border/60 font-mono"
              {...register("cpf")}
              onChange={(e) => setValue("cpf", maskCpf(e.target.value))}
            />
            {errors.cpf && <p className="text-destructive text-xs">{errors.cpf.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rg" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              RG *
            </Label>
            <Input id="rg" className="h-10 bg-card border-border/60 font-mono" {...register("rg")} />
            {errors.rg && <p className="text-destructive text-xs">{errors.rg.message}</p>}
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="endereco" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Endereço *
            </Label>
            <Input id="endereco" className="h-10 bg-card border-border/60" {...register("endereco")} />
            {errors.endereco && <p className="text-destructive text-xs">{errors.endereco.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profissao" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profissão
            </Label>
            <Input id="profissao" className="h-10 bg-card border-border/60" {...register("profissao")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="telefone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Telefone
            </Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              className="h-10 bg-card border-border/60 font-mono"
              {...register("telefone")}
              onChange={(e) => setValue("telefone", maskPhone(e.target.value))}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail *{" "}
              <span className="text-muted-foreground/60 normal-case font-normal">(usado para login)</span>
            </Label>
            <Input id="email" type="email" className="h-10 bg-card border-border/60" {...register("email")} />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="senha" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha *
            </Label>
            <Input id="senha" type="password" className="h-10 bg-card border-border/60" {...register("senha")} />
            {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmSenha" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirmar Senha *
            </Label>
            <Input id="confirmSenha" type="password" className="h-10 bg-card border-border/60" {...register("confirmSenha")} />
            {errors.confirmSenha && <p className="text-destructive text-xs">{errors.confirmSenha.message}</p>}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-1 btn-shimmer font-heading font-semibold tracking-widest uppercase text-sm gap-2 border-0"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          {isSubmitting ? "Criando conta..." : "Criar Conta"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}

