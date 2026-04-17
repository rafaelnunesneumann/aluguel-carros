"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAgente } from "@/services/authService";
import { onlyDigits } from "@/lib/formatters";

const schema = z
  .object({
    razaoSocial: z.string().min(1, "Razão social é obrigatória").max(200),
    cnpj: z.string().refine((v) => onlyDigits(v).length === 14, "CNPJ deve ter 14 dígitos"),
    endereco: z.string().min(1, "Endereço é obrigatório").max(255),
    login: z.string().email("Login deve ser um e-mail válido"),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    confirmSenha: z.string().min(1, "Confirme a senha"),
    tipo: z.enum(["EMPRESA", "BANCO"], { message: "Tipo é obrigatório" }),
  })
  .refine((d) => d.senha === d.confirmSenha, {
    message: "Senhas não conferem",
    path: ["confirmSenha"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  onBack: () => void;
}

export default function RegisterAgenteForm({ onBack }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await registerAgente({ ...data, cnpj: onlyDigits(data.cnpj) });
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
        <h2 className="font-heading text-3xl font-bold tracking-wide">Cadastro Empresarial</h2>
        <p className="text-muted-foreground text-sm mt-1">Preencha os dados da instituição</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="razaoSocial" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Razão Social *
          </Label>
          <Input id="razaoSocial" className="h-10 bg-card border-border/60" {...register("razaoSocial")} />
          {errors.razaoSocial && <p className="text-destructive text-xs">{errors.razaoSocial.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cnpj" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CNPJ *
            </Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              className="h-10 bg-card border-border/60 font-mono"
              {...register("cnpj")}
            />
            {errors.cnpj && <p className="text-destructive text-xs">{errors.cnpj.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tipo" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tipo *
            </Label>
            <select
              id="tipo"
              {...register("tipo")}
              className="flex h-10 w-full rounded-md border border-border/60 bg-card px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
            >
              <option value="">Selecione...</option>
              <option value="EMPRESA">Empresa</option>
              <option value="BANCO">Banco</option>
            </select>
            {errors.tipo && <p className="text-destructive text-xs">{errors.tipo.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endereco" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Endereço *
          </Label>
          <Input id="endereco" className="h-10 bg-card border-border/60" {...register("endereco")} />
          {errors.endereco && <p className="text-destructive text-xs">{errors.endereco.message}</p>}
        </div>

        <div className="border-t border-border/40 pt-4 flex flex-col gap-1.5">
          <Label htmlFor="login" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Login (e-mail) *
          </Label>
          <Input id="login" type="email" className="h-10 bg-card border-border/60" {...register("login")} />
          {errors.login && <p className="text-destructive text-xs">{errors.login.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="senha" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha *
            </Label>
            <Input id="senha" type="password" className="h-10 bg-card border-border/60" {...register("senha")} />
            {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmSenha" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirmar *
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
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Building2 className="size-4" />}
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
