import LibraryCardGrid from "@/components/learn/LibraryCardGrid";

type SearchItem = {
  slug: string;
  type: "song" | "course" | "pack";
  title: {
    pt: string;
    en: string;
  };
  artist?: string;
  price: {
    brl: number;
    usd: number;
  };
  image: string;
  href: string;
};

type SearchResultsProps = {
  search: string;
  language: "pt" | "en";
  currency: "BRL" | "USD";
  items: SearchItem[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchResults({
  search,
  language,
  currency,
  items,
}: SearchResultsProps) {
  const query = normalizeText(search);

  const results = items.filter((item) => {
    const titles = Object.values(item.title);
    const artist = item.artist ?? "";

    const matchesTitle = titles.some((title) =>
      normalizeText(title).includes(query),
    );

    const matchesArtist = normalizeText(artist).includes(query);

    return matchesTitle || matchesArtist;
  });

  if (results.length === 0) {
    return (
      <div className="py-16 text-center text-muted">
        {language === "pt"
          ? "Nenhum resultado encontrado."
          : "No results found."}
      </div>
    );
  }

  return (
    <LibraryCardGrid items={results} language={language} currency={currency} />
  );
}
