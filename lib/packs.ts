import { Pack } from "@/types/pack";

export const packs: Pack[] = [
  {
    slug: "worship-pack-vol-1",

    title: {
      pt: "Pack Worship Vol. 1",
      en: "Worship Pack Vol. 1",
    },
    description: {
      pt: "Coleção de timbres para guitarra.",
      en: "Collection of guitar tones.",
    },
    items: [
      {
        type: "song",
        slug: "how-great-is-our-god",
      },
      {
        type: "song",
        slug: "oceans",
      },
      {
        type: "preset",
        slug: "line-6-helix-worship-clean",
      },
      {
        type: "pdf",
        slug: "worship-chords-guide",
      },
    ],
    price: {
      brl: 197,
      usd: 19,
    },
    image: "/images/packs/worship-pack-vol-1.jpg",
    featured: true,
    published: true,
  },
];
