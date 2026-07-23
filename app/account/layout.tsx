"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AccountSidebar from "@/components/account/AccountSidebar";
import Header from "@/components/layout/Header";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.name?.trim().split(" ")[0] ?? "Aluno";

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl px-6 py-28">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-white">
            Olá, {firstName}!
          </h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <AccountSidebar />

          <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
            {children}
          </section>
        </div>
      </main>
    </>
  );
}
