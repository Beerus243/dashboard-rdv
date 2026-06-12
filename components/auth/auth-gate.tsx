"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingState } from "@/components/ui/app-primitives";

export function AuthGate({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "guest" | "protected";
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (mode === "protected" && !isAuthenticated) {
      router.replace("/login");
    }
    if (mode === "guest" && isAuthenticated) {
      router.replace("/accueil");
    }
  }, [isAuthenticated, isLoading, mode, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rdv-bg">
        <LoadingState />
      </div>
    );
  }

  if (mode === "protected" && !isAuthenticated) return null;
  if (mode === "guest" && isAuthenticated) return null;

  return children;
}
