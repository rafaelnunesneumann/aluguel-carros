"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
