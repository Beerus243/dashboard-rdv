import { AuthGate } from "@/components/auth/auth-gate";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthGate mode="guest">
      <main className="min-h-screen bg-gradient-to-b from-rdv-bg to-rdv-surface">
        <LoginForm />
      </main>
    </AuthGate>
  );
}
