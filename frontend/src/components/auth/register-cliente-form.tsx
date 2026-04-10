"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Erro ao criar conta";
      toast.error(msg);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit -ml-2 mb-1">
          <ArrowLeft className="size-4 mr-1" /> Voltar
        </Button>
        <CardTitle>Cadastro de Cliente</CardTitle>
        <CardDescription>Preencha seus dados para criar uma conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input id="nome" {...register("nome")} />
              {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                {...register("cpf")}
                onChange={(e) => setValue("cpf", maskCpf(e.target.value))}
              />
              {errors.cpf && <p className="text-destructive text-xs">{errors.cpf.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rg">RG *</Label>
              <Input id="rg" {...register("rg")} />
              {errors.rg && <p className="text-destructive text-xs">{errors.rg.message}</p>}
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input id="endereco" {...register("endereco")} />
              {errors.endereco && <p className="text-destructive text-xs">{errors.endereco.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profissao">Profissão</Label>
              <Input id="profissao" {...register("profissao")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                {...register("telefone")}
                onChange={(e) => setValue("telefone", maskPhone(e.target.value))}
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail * <span className="text-muted-foreground font-normal text-xs">(usado para login)</span></Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senha">Senha *</Label>
              <Input id="senha" type="password" {...register("senha")} />
              {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmSenha">Confirmar Senha *</Label>
              <Input id="confirmSenha" type="password" {...register("confirmSenha")} />
              {errors.confirmSenha && <p className="text-destructive text-xs">{errors.confirmSenha.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Criar conta
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
              Entrar
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
