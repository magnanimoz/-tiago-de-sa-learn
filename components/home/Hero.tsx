import Container from "@/components/ui/Container";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center">
      <Container className="flex flex-col justify-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-magenta">
          Guitarist · Artist · Educator
        </p>

        <h1 className="max-w-5xl text-[clamp(4.5rem,10vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.07em]">
          Tiago
          <br />
          de Sá
        </h1>

        <p className="mt-10 max-w-lg text-lg leading-8 text-muted">
          Guitarrista, produtor e educador. Aulas, timbres e interpretações para
          quem deseja tocar com intenção e musicalidade.
        </p>

        <div className="mt-12 flex gap-4">
          <Link
            href="/learn"
            className="rounded-full bg-foreground px-8 py-3 text-background transition hover:scale-[1.02]"
          >
            Learn
          </Link>

          <Link
            href="/portfolio"
            className="rounded-full border border-border px-8 py-3 transition hover:border-magenta hover:text-magenta"
          >
            Portfolio
          </Link>
        </div>
      </Container>
    </section>
  );
}
