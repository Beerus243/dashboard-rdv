import { AdminGate } from "@/components/admin/admin-gate";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = {
  title: "Admin — Connexion | RDV",
};

export default function AdminLoginPage() {
  return (
    <AdminGate mode="guest">
      <main className="admin-root min-h-screen bg-rdv-bg dark:bg-rdv-bg">
        <div className="rdv-gradient-hero px-4 pb-16 pt-10 dark:bg-none dark:pb-0 dark:pt-0">
          <AdminLoginForm />
        </div>
      </main>
    </AdminGate>
  );
}
