import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    slug: "como-me-preparo-para-o-domingo",
    title: {
      pt: "Como me preparo para o domingo",
      en: "How I Prepare for Sunday",
    },
    description: {
      pt: "Minha rotina completa de preparação para tocar na igreja, desde o estudo até a passagem de som.",
      en: "My complete preparation workflow for playing at church, from practice to soundcheck.",
    },
    instructor: "Tiago de Sá",
    duration: "2h 45m",
    level: "Beginner",
    lessons: [],
    previewVideo: "",
    image: "/images/courses/como-me-preparo.jpg",
    price: {
      brl: 147,
      usd: 29,
    },
    featured: true,
    published: true,
  },

  {
    slug: "curso-de-forma-linear",
    title: {
      pt: "Curso de Forma Linear",
      en: "Linear Shapes Course",
    },
    description: {
      pt: "Aprenda a visualizar o braço da guitarra de forma linear, conectando escalas e frases sem ficar preso aos boxes.",
      en: "Learn to see the fretboard linearly by connecting scales and phrases beyond box patterns.",
    },
    instructor: "Tiago de Sá",
    duration: "5h 30m",
    level: "Intermediate",
    lessons: [],
    previewVideo: "",
    image: "/images/courses/forma-linear.jpg",
    price: {
      brl: 297,
      usd: 59,
    },
    featured: true,
    published: true,
  },

  {
    slug: "timbre-e-regulagem",
    title: {
      pt: "Timbre e Regulagem",
      en: "Tone & Guitar Setup",
    },
    description: {
      pt: "Entenda como regular sua guitarra, configurar pedais e montar um timbre consistente para qualquer situação.",
      en: "Learn how to set up your guitar, pedals and build a consistent tone for any situation.",
    },
    instructor: "Tiago de Sá",
    duration: "3h 20m",
    level: "Beginner",
    lessons: [],
    previewVideo: "",
    image: "/images/courses/timbre-regulagem.jpg",
    price: {
      brl: 197,
      usd: 39,
    },
    featured: true,
    published: true,
  },
];
