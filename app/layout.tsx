import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AdminAuthProvider } from "@/components/providers/admin-auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RDV — Rencontres",
  description: "Application de rencontres RDV — découverte, matchs et messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full bg-rdv-bg text-rdv-text">
        <ThemeProvider>
          <AuthProvider>
            <AdminAuthProvider>{children}</AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
