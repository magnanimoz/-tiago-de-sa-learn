export type PackItemType =
  | "song"
  | "preset"
  | "ir"
  | "backing-track"
  | "pdf"
  | "video";

export interface PackItem {
  type: PackItemType;
  slug: string;
}
