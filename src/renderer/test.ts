import { Test, Question, Answer, QuestionType } from './types';
import { ElectronHandler } from '../main/preload';
import { usePapaParse } from 'react-papaparse';
import { parse } from 'path';

const { readString } = usePapaParse();

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

interface TestCsvRow {
  Section: string,
  Question: string,
  Passage: string,
  A: string,
  B: string,
  C: string,
  D: string,
  Correct: string,
  Categories: string,
}

const choiceLetters: string[] = ["A", "B", "C", "D"];

export const loadTest = async (path: string): Promise<Test | null> => {
  var test: Test = {
    questions: [],
    answers: []
  };
  try {
    await window.electron.fileSystem.readFile(path).then((file) => {
      readString(file, {
        header: true,
        complete: (results) => {
          test = {
            questions: [],
            answers: []
          };
          const rows: TestCsvRow[] = results.data as TestCsvRow[];
          rows.forEach((row: TestCsvRow, i: number) => {
            const section: number = parseInt(row["Section"]) - 1;
            const type: QuestionType = section > 2 ? "math" : "reading";
            const passage: string | null = !row["Passage"] ? null : row["Passage"];
            const question: string = row["Question"];

            var choices: string[] | null = null;
            var correct: number | null = null;
            var freeResponse: string | null = row["Correct"];

            if(row["A"] && row["B"] && row["C"] && row["D"]
                && choiceLetters.indexOf(row["Correct"]) != -1) {
              choices = [row["A"], row["B"], row["C"], row["D"]];
              correct = choiceLetters.indexOf(row["Correct"]);
              freeResponse = null;
            }

            const categories: string[] = row["Categories"]
              .split(",")
              .map(word => word.trim())
              .filter(word => word.length > 0);

            test.questions.push({
              id: i,
              section: section,
              type: type,
              passage: passage,
              question: question,
              choices: choices,
              categories: categories
            });

            test.answers.push({
              id: i,
              choice: correct,
              freeResponseRaw: freeResponse
            });
          });

          console.log(test);
        },
      });
    });
    return test;
  } catch (error) {
    console.log(error);
  }
  return null;
}
