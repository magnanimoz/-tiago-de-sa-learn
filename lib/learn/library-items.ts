import { songs } from "@/lib/songs";
import { courses } from "@/lib/courses";
import { packs } from "@/lib/packs";
import { LibraryItem } from "@/types/library-item";

export function getLibraryItems(): LibraryItem[] {
  return [
    ...songs.map((song) => ({
      type: "song" as const,
      slug: song.slug,
      title: song.title,
      artist: song.artist,
      image: song.image,
      price: song.price,
      href: `/learn/${song.slug}`,
    })),

    ...courses.map((course) => ({
      type: "course" as const,
      slug: course.slug,
      title: course.title,
      image: course.image,
      price: course.price,
      href: `/courses/${course.slug}`,
    })),

    ...packs.map((pack) => ({
      type: "pack" as const,
      slug: pack.slug,
      title: pack.title,
      image: pack.image,
      price: pack.price,
      href: `/packs/${pack.slug}`,
    })),
  ];
}
