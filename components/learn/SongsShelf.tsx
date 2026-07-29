import LibraryCard from "@/components/learn/LibraryCard";
import Shelf from "@/components/learn/Shelf";

import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";
import { learnText } from "@/lib/i18n/learn";
import { t } from "@/lib/t";

type SongsShelfProps = {
  language: Locale;
  currency: "BRL" | "USD";
};

export default async function SongsShelf({
  language,
  currency,
}: SongsShelfProps) {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        slug,
        title_pt,
        title_en,
        artist,
        price_brl,
        price_usd,
        image
      `,
    )
    .eq("type", "song")
    .eq("published", true);

  if (error) {
    console.error("Erro ao carregar músicas:", error);
    return null;
  }

  return (
    <Shelf title={t(learnText.recentlyAdded, language)}>
      {(products ?? []).map((product) => (
        <LibraryCard
          key={product.slug}
          artist={product.artist ?? undefined}
          title={
            language === "pt"
              ? product.title_pt
              : (product.title_en ?? product.title_pt)
          }
          price={{
            brl: Number(product.price_brl),
            usd: Number(product.price_usd),
          }}
          currency={currency}
          image={product.image ?? ""}
          href={`/learn/${product.slug}`}
        />
      ))}
    </Shelf>
  );
}
