import { Locale } from "./i18n";

const dictionary = {
  pt: {
    learn: "Aprenda",
    songLessons: "Aulas",
    buyLesson: "Comprar aula",
  },

  en: {
    learn: "Learn",
    songLessons: "Song Lessons",
    buyLesson: "Buy lesson",
  },
};

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}
