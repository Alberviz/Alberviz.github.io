import type { LocalizedText } from "./types";

export const PROFILE = {
  fullName: "Alberto Vizcaíno Ponte",
  handle: "Alberviz",
  email: "albvizpon@gmail.com",
  githubUrl: "https://github.com/Alberviz",
  linkedinUrl: "https://www.linkedin.com/in/alberto-vizca%C3%ADno-ponte",
  cvPath: "/cv/Alberto_Vizcaino_Ponte_CV.pdf",
  currentLocation: {
    en: "Kraków, Poland · Murcia, Spain",
    es: "Cracovia, Polonia · Murcia, España",
  } satisfies LocalizedText,
};

export const BACKGROUND_UI = {
  heading: { en: "Where I come from.", es: "De dónde vengo." },
  lead: {
    en: "Real software in a company, a double degree that mixes proofs with code, and a year in Kraków.",
    es: "Software de verdad en una empresa, un doble grado que mezcla demostraciones con código y un año en Cracovia.",
  },
  work: { en: "Work", es: "Trabajo" },
  study: { en: "Study", es: "Estudios" },
  honors: { en: "Honors", es: "Reconocimientos" },
} satisfies Record<string, LocalizedText>;

export const EXPERIENCE = {
  company: "STEL Order",
  role: { en: "Software Engineer Intern", es: "Software Engineer Intern" } satisfies LocalizedText,
  period: { en: "Jun to Aug 2026", es: "Jun a ago 2026" } satisfies LocalizedText,
  place: { en: "Murcia, Spain", es: "Murcia, España" } satisfies LocalizedText,
  summary: {
    en: "I built the cloud point-of-sale module of a commercial ERP, start to finish.",
    es: "Construí de principio a fin el módulo de punto de venta en la nube de un ERP comercial.",
  } satisfies LocalizedText,
  bullets: [
    {
      en: "A React catalogue, receipt generation and the sync with the server.",
      es: "Un catálogo en React, la generación de tickets y la sincronización con el servidor.",
    },
    {
      en: "Components for the ERP's built-in AI assistant.",
      es: "Componentes para el asistente de IA integrado en el ERP.",
    },
  ] satisfies LocalizedText[],
  stack: ["React", "TypeScript", "Git"],
};

export const STUDY = [
  {
    title: {
      en: "Double degree in Mathematics and Computer Engineering",
      es: "Doble Grado en Matemáticas e Ingeniería Informática",
    },
    detail: { en: "Universidad de Murcia, expected 2028", es: "Universidad de Murcia, prevista para 2028" },
    when: "2028",
  },
  {
    title: { en: "Erasmus+ academic year in Kraków", es: "Curso Erasmus+ en Cracovia" },
    detail: { en: "AGH University of Kraków, Poland", es: "AGH University of Kraków, Polonia" },
    when: "2026-27",
  },
] satisfies { title: LocalizedText; detail: LocalizedText; when: string }[];

export const HONORS = [
  {
    title: { en: "Highest Honors in Algorithms", es: "Matrícula de Honor en Algoritmos" },
    detail: {
      en: "Algorithms and Data Structures, Universidad de Murcia.",
      es: "Algoritmos y Estructuras de Datos, Universidad de Murcia.",
    },
  },
  {
    title: { en: "2x 7th place, Programming Olympiad", es: "2x 7.º puesto, Olimpiada de Programación" },
    detail: {
      en: "Region of Murcia. C++ under strict time and memory limits.",
      es: "Región de Murcia. C++ con límites estrictos de tiempo y memoria.",
    },
  },
  {
    title: { en: "Accésit, Spanish Mathematical Olympiad", es: "Accésit, Olimpiada Matemática Española" },
    detail: { en: "Regional phase.", es: "Fase regional." },
  },
] satisfies { title: LocalizedText; detail: LocalizedText }[];
