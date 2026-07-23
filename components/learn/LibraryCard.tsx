import Link from "next/link";
import { Price } from "@/types/price";
import { formatPrice } from "@/lib/format-price";
import { useAuthModal } from "@/contexts/AuthModalContext";

type LibraryCardProps = {
  title: string;
  image: string;
  artist?: string;
  href: string;
  price: Price;
  currency: "BRL" | "USD";
};

export default function LibraryCard({
  title,
  image,
  artist,
  href,
  price,
  currency,
}: LibraryCardProps) {
  const { openLoginModal } = useAuthModal();
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    openLoginModal();
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group/card block w-[320px] flex-shrink-0 transition-transform duration-700 ease-out hover:scale-[1.07]"
    >
      <div className="relative aspect-[369/207] overflow-hidden rounded-2xl bg-card">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-107"
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-full
              border border-white/20
              bg-black/40
              backdrop-blur-xl

              opacity-0
              scale-75

              transition-all
              duration-300
              ease-out

              group-hover/card:opacity-100
              group-hover/card:scale-100
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 fill-white"
              aria-hidden="true"
            >
              <path d="M9 7.5v9l7-4.5-7-4.5Z" />
            </svg>
          </div>
        </div>

        <div className="absolute right-3 top-2">
          <span className="rounded-full border border-white/10 bg-zinc-950/80 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-400 backdrop-blur-xl">
            {formatPrice(price, currency)}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/70">
            {artist}
          </p>
          <h3 className=" line-clamp-1 text-base font-medium tracking-[-0.02em] text-white">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
