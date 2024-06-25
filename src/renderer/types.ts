export type QuestionType = "reading" | "math";

export interface Question {
  type: QuestionType;
  passage: string | null;
  question: string;
  choices: string[] | null;
}

export interface Answer {
  question: number;
  choice: number | null;
  freeResponseRaw: string | null;
}
