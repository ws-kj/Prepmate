export type QuestionType = "reading" | "math";

export interface Question {
  id: number;
  type: QuestionType;
  passage: string | null;
  question: string;
  choices: string[] | null;
}

export interface Answer {
  id: number;
  choice: number | null;
  freeResponseRaw: string | null;
}
