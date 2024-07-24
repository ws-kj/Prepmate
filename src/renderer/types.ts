import { ScoreScale } from "./grade";

export type QuestionType = "reading" | "math";

export interface Question {
  id: number;
  section: number;
  qNumber: number;
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
  section: number,
  qNum: number,
  path: string
}

export interface TestConfig {
  testName: string,
  studentName: string,
  test: Test,
  sectionLengths: number[],
  breaks: Break[],
  images: ImageSrc[],
  scoreScale: ScoreScale | null
}

export const sectionTitles = [
  "Section 1, Module 1: Reading and Writing",
  "Section 1, Module 2: Reading and Writing",
  "Section 2, Module 1: Math",
  "Section 2, Module 2: Math"
];

export const choiceLetters = [ 'A' , 'B', 'C', 'D' ];

export interface Annotation {
  questionId: number;
  start: number;
  end: number;
  text: string;
}
