"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/components/providers/admin-auth-provider";
import { LoadingState } from "@/components/ui/app-primitives";

export function AdminGate({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "guest" | "protected";
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (isLoading) return;
    if (mode === "protected" && !isAuthenticated) {
      router.replace("/admin/login");
    }
    if (mode === "guest" && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, mode, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingState label="Vérification de la session admin…" />
      </div>
    );
  }

  if (mode === "protected" && !isAuthenticated) return null;
  if (mode === "guest" && isAuthenticated) return null;

  return children;
}
