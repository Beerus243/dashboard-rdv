import { AdminGate } from "@/components/admin/admin-gate";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = {
  title: "Admin — Connexion | RDV",
};

export default function AdminLoginPage() {
  return (
    <AdminGate mode="guest">
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <AdminLoginForm />
      </main>
    </AdminGate>
  );
}
