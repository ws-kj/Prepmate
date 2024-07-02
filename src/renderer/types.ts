export type QuestionType = "reading" | "math";

export interface Question {
  id: number;
  section: number;
  type: QuestionType;
  passage: string | null;
  question: string;
  choices: string[] | null;
  categories: string[];
}

export interface Answer {
  id: number;
  choice: number | null;
  freeResponseRaw: string | null;
}

export interface Test {
  questions: Question[],
  answers: Answer[],
}

export interface Break {
  prevSection: number,
  length: number
}

export interface ImageSrc {
  questionId: number,
  path: string
}

export interface TestConfig {
  test: Test,
  sectionLengths: number[],
  breaks: Break[],
  markedQuestions: number[]
  images: ImageSrc[]
}

export const sectionTitles = [
  "Section 1, Module 1: Reading and Writing",
  "Section 1, Module 2: Reading and Writing",
  "Section 2, Module 1: Math",
  "Section 2, Module 2: Math"
];
