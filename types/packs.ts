import { Pack } from "@/types/pack";

export const packs: Pack[] = [
  {
    slug: "bethel-music-pack",

    title: {
      pt: "Bethel Music Pack",
      en: "Bethel Music Pack",
    },

    description: {
      pt: "As principais músicas da Bethel Music.",
      en: "The best Bethel Music songs.",
    },

    price: {
      brl: 249,
      usd: 49,
    },

    image: "/images/bethel-music-pack.jpg",

    items: ["lion-and-the-lamb", "goodness-of-god", "raise-a-hallelujah"],

    featured: true,
    published: true,
  },
  {
    slug: "elevation-worship-pack",

    title: {
      pt: "Elevation Worship Pack",
      en: "Elevation Worship Pack",
    },

    description: {
      pt: "As principais músicas da Elevation Worship.",
      en: "The best Elevation Worship songs.",
    },

    price: {
      brl: 249,
      usd: 49,
    },

    image: "/images/packs/elevation-worship.jpg",

    items: ["graves-into-gardens", "jira", "see-a-victory"],

    featured: true,
    published: true,
  },
  {
    slug: "paz-worship-pack",

    title: {
      pt: "Paz Worship Pack",
      en: "Paz Worship Pack",
    },

    description: {
      pt: "As principais músicas da Paz Worship.",
      en: "The best Paz Worship songs.",
    },

    price: {
      brl: 249,
      usd: 49,
    },

    image: "/images/packs/paz-worship.jpg",

    items: ["te-adorarei", "graca-sobre-graca", "esperanca"],

    featured: true,
    published: true,
  },
];
