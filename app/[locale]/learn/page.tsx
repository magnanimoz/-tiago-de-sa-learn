import LearnPageClient from "@/components/learn/LearnPageClient";
import { createClient } from "@/lib/supabase/server";

export default async function LearnPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        slug,
        type,
        title_pt,
        title_en,
        artist,
        price_brl,
        price_usd,
        image,
        featured
      `,
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar produtos:", error);
  }

  const { data: accessRows, error: accessError } = user
    ? await supabase.from("content_access").select("content_type, content_id")
    : { data: [], error: null };

  if (accessError) {
    console.error("Erro ao carregar acessos do usuário:", accessError);
  }

  const purchasedKeys = new Set(
    (accessRows ?? []).map(
      (access) => `${access.content_type}:${access.content_id}`,
    ),
  );

  const normalizedProducts =
    products?.map((product) => ({
      slug: product.slug,
      type: product.type as "song" | "course" | "pack",

      title: {
        pt: product.title_pt,
        en: product.title_en,
      },

      artist: product.artist ?? undefined,

      price: {
        brl: Number(product.price_brl),
        usd: Number(product.price_usd),
      },

      image: product.image ?? "",
      featured: product.featured ?? false,

      href:
        product.type === "pack"
          ? `/packs/${product.slug}`
          : `/learn/${product.slug}`,
      hasAccess: purchasedKeys.has(`${product.type}:${product.slug}`),
    })) ?? [];

  const featuredProducts = normalizedProducts.filter(
    (product) => product.featured,
  );

  const purchasedProducts = normalizedProducts.filter(
    (product) => product.hasAccess,
  );

  const songs = normalizedProducts.filter((product) => product.type === "song");

  const courses = normalizedProducts.filter(
    (product) => product.type === "course",
  );

  const packs = normalizedProducts.filter((product) => product.type === "pack");

  return (
    <LearnPageClient
      purchasedProducts={purchasedProducts}
      featuredProducts={featuredProducts}
      songs={songs}
      courses={courses}
      packs={packs}
    />
  );
}
