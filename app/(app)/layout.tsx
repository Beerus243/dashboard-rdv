import { AuthGate } from "@/components/auth/auth-gate";
import { BottomNav } from "@/components/navigation/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate mode="protected">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col bg-rdv-bg pb-28">
        {children}
        <BottomNav />
      </div>
    </AuthGate>
  );
}
