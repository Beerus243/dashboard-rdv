import { AdminGate } from "@/components/admin/admin-gate";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin | RDV",
};

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate mode="protected">
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
