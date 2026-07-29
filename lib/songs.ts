import { Song } from "@/types/song";

export const songs: Song[] = [
  {
    slug: "lion-and-the-lamb",
    title: {
      pt: "O Leão e o Cordeiro",
      en: "Lion and the Lamb",
    },
    artist: "Leeland",
    description: {
      pt: "Aprenda os principais riffs, acordes e dinâmicas da música.",
      en: "Learn the main riffs, chords and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "34 min",
    key: "G",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/lion-and-the-lamb.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "way-maker",
    title: {
      pt: "Caminho no Deserto",
      en: "Way Maker",
    },
    artist: "Leeland",
    description: {
      pt: "Aprenda os acordes, a dinâmica e a construção da música.",
      en: "Learn the chords, dynamics and structure of the song.",
    },
    difficulty: "Beginner",
    price: {
      brl: 19.99,
      usd: 3.99,
    },
    duration: "28 min",
    key: "E",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/way-maker.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: false,
    published: true,
  },
  {
    slug: "gratitude",
    title: {
      pt: "Gratidão",
      en: "Gratitude",
    },
    artist: "Brandon Lake",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "31 min",
    key: "A",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/lion-and-the-lamb.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "goodness-of-god",
    title: {
      pt: "Bondade de Deus",
      en: "Goodness of God",
    },
    artist: "Bethel Music",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Beginner",
    price: {
      brl: 0,
      usd: 0,
    },
    duration: "24 min",
    key: "G",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/way-maker.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "same-god",
    title: {
      pt: "Mesmo Deus",
      en: "Same God",
    },
    artist: "Elevation Worship",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "29 min",
    key: "D",
    tuning: "Standard",
    capo: "2nd fret",
    image: "/images/lion-and-the-lamb.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "what-a-beautiful-name",
    title: {
      pt: "Oh Quão Lindo Esse Nome É",
      en: "What A Beautiful Name",
    },
    artist: "Hillsong Worship",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "36 min",
    key: "D",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/way-maker.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "raise-a-hallelujah",
    title: {
      pt: "Raise A Hallelujah",
      en: "Raise A Hallelujah",
    },
    artist: "Bethel Music",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "33 min",
    key: "G",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/lion-and-the-lamb.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "living-hope",
    title: {
      pt: "Esperança Viva",
      en: "Living Hope",
    },
    artist: "Phil Wickham",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "35 min",
    key: "E",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/way-maker.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "king-of-kings",
    title: {
      pt: "Rei dos Reis",
      en: "King of Kings",
    },
    artist: "Hillsong Worship",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Advanced",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "38 min",
    key: "A",
    tuning: "Standard",
    capo: "No capo",
    image: "/images/lion-and-the-lamb.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "the-blessing",
    title: {
      pt: "A Bênção",
      en: "The Blessing",
    },
    artist: "Kari Jobe & Cody Carnes",
    description: {
      pt: "Aprenda os acordes, levadas e dinâmicas da música.",
      en: "Learn the chords, strumming patterns and dynamics of the song.",
    },
    difficulty: "Intermediate",
    price: {
      brl: 24.99,
      usd: 4.99,
    },
    duration: "40 min",
    key: "B",
    tuning: "Standard",
    capo: "4th fret",
    image: "/images/way-maker.jpg",
    previewVideo: "/videos/aula-teste.mp4",
    lessons: [
      {
        id: "intro",
        title: {
          pt: "Introdução e estrutura",
          en: "Introduction and structure",
        },
        description: {
          pt: "Conheça a estrutura da música e os principais pontos que vamos trabalhar.",
          en: "Learn the song structure and the main elements we'll work on.",
        },
        duration: "05:20",
        videoUrl: "/videos/lion-and-the-lamb/01-intro.mp4",
      },
      {
        id: "riffs",
        title: {
          pt: "Riffs e partes principais",
          en: "Main riffs and parts",
        },
        description: {
          pt: "Aprenda os riffs principais e como encaixá-los na música.",
          en: "Learn the main riffs and how to apply them in the song.",
        },
        duration: "08:40",
        videoUrl: "/videos/lion-and-the-lamb/02-riffs.mp4",
      },
      {
        id: "dynamics",
        title: {
          pt: "Dinâmica e execução",
          en: "Dynamics and performance",
        },
        description: {
          pt: "Trabalhe dinâmica, intensidade e transições entre as partes.",
          en: "Work on dynamics, intensity, and transitions between sections.",
        },
        duration: "09:15",
        videoUrl: "/videos/lion-and-the-lamb/03-dynamics.mp4",
      },
      {
        id: "full-song",
        title: {
          pt: "Tocando a música completa",
          en: "Playing the full song",
        },
        description: {
          pt: "Toque a música completa aplicando tudo o que foi visto na aula.",
          en: "Play through the full song using everything covered in the lesson.",
        },
        duration: "10:45",
        videoUrl: "/videos/lion-and-the-lamb/04-full-song.mp4",
      },
    ],
    featured: true,
    published: true,
  },
];
