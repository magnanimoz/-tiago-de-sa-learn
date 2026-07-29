import type { TranslatedText } from "@/types/translated-text";

export type Lesson = {
  id: string;
  title: TranslatedText;
  description: TranslatedText;
  duration: string;
  videoUrl: string;
};
