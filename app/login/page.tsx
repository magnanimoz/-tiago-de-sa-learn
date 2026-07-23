import LoginCard from "@/components/auth/LoginCard";
import LoginHero from "@/components/auth/LoginHero";
import Header from "@/components/layout/Header";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#101012]">
      <Header />

      <LoginHero />

      <section className="relative px-6 py-10">
        {/* Blue glow */}
        {/* <div className="pointer-events-none absolute left-0 top-0 h-[32rem] w-[32rem] rounded-full bg-[#355cff]/10 blur-[180px]" /> */}
        {/* Pink glow */}
        {/* <div className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-[#e6007e]/10 blur-[180px]" /> */}
        <div className="relative z-10 mx-auto w-full max-w-md">
          <LoginCard />
        </div>
      </section>
    </main>
  );
}
