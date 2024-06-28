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
