import { Question, Answer, Test, TestConfig, choiceLetters } from './types';

import { ElectronHandler } from '../main/preload';
import { usePapaParse } from 'react-papaparse';


const { readString } = usePapaParse();

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

export interface GradedAnswer {
  correct: boolean;
  question: Question;
  answer: Answer;
  response: Answer | null;
}

export interface BlockResult {
  section: number | null;
  category: string | null;
  total: number;
  correct: number;
  ids: number[];
}

export interface GradedTest {
  testName: string;
  studentName: string;
  timestamp: string;
  answers: GradedAnswer[];
  sectionResults: BlockResult[];
  categoryResults: BlockResult[];
  overallTotal: number;
  readingTotal: number;
  mathTotal: number;
  scoreRange: string;
}

interface ScoreCsvRow {
  Correct: string;
  Lower: string;
  Upper: string;
}

interface ScoreRow {
  correct: number;
  low: string;
  high: string;
}

export interface ScoreScale {
  reading: ScoreRow[];
  math: ScoreRow[];
}

export const gradeTest = (config: TestConfig, responses: (Answer | null)[]): GradedTest => {
  const date = new Date();
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });
  const ts = year + "-" + month + "-" + day;

  var result: GradedTest = {
    testName: config.testName,
    studentName: config.studentName,
    timestamp: ts,
    overallTotal: 0,
    readingTotal: 0,
    mathTotal: 0,
    answers: [],
    sectionResults: [],
    categoryResults: [],
    scoreRange: 'N/A',
  };

  config.test.questions.forEach((q, i) => {
    const a = config.test.answers[i];
    const response = responses[i]
    var correct: boolean = false;

    if(response != null) {
      if(a.choice != null && response.choice != null) {
        if(a.choice == response.choice) {
          correct = true;
        }
      } else if(a.freeResponseRaw != null && response.freeResponseRaw != null) {
        if(eval(a.freeResponseRaw) == eval(response.freeResponseRaw)) {
          correct = true;
        }
      }
    }

    var graded: GradedAnswer = {
      correct: correct,
      question: q,
      answer: a,
      response: response
    }

    result.answers.push(graded);
    if(correct) {
      result.overallTotal += 1;
      if(q.type == 'reading') result.readingTotal += 1;
      if(q.type == 'math') result.mathTotal += 1;
    }

    var secIdx = result.sectionResults.findIndex(b => b.section == q.section);
    if(secIdx == -1) {
      result.sectionResults.push({
        section: q.section,
        category: null,
        total: 0,
        correct: 0,
        ids: []
      });
      secIdx = result.sectionResults.findIndex(b => b.section == q.section);
    }
    result.sectionResults[secIdx].total += 1;
    if(correct) result.sectionResults[secIdx].correct += 1;
    result.sectionResults[secIdx].ids.push(q.id);

    q.categories.forEach(c => {
      var catIdx = result.categoryResults.findIndex(b => b.category == c);
      if(catIdx == -1) {
        result.categoryResults.push({
          section: null,
          category: c,
          total: 0,
          correct: 0,
          ids: []
        });
        catIdx = result.categoryResults.findIndex(b => b.category == c);
      }
      result.categoryResults[catIdx].total += 1;
      if(correct) result.categoryResults[catIdx].correct += 1;
      result.categoryResults[catIdx].ids.push(q.id);
    });
  });

  result.scoreRange = convertToScore(config.scoreScale, result);

  return result;
}

const toScoreRow = (r: ScoreCsvRow): ScoreRow => {
  return {
    correct: parseInt(r["Correct"]),
    low: r["Lower"],
    high: r["Upper"]
  };
}

export const loadScoreScale = async (path: string): Promise<ScoreScale | null>  => {
  console.log("LOAD");
  if (path == "") return null;
  console.log(path);
  try {
    var scale: ScoreScale = { reading: [], math: [] };
    await window.electron.fileSystem.readFile(path).then((file) => {
      readString(file, {
        header: true,
        complete: (results) => {
          const csvRows: ScoreCsvRow[] = results.data as ScoreCsvRow[];
          const rows: ScoreRow[] = csvRows.map(r => toScoreRow(r));
          const mid = rows.indexOf(rows.filter((r, i) => i != 0 && r.correct == 0)[0]);

          const reading = rows.slice(0, mid);
          const math = rows.slice(mid, rows.length);
          console.log(rows);
          scale = { reading: reading, math: math };
        }
      });
    });
    return scale;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const convertToScore = (scale: ScoreScale | null, gt: GradedTest): string => {
  if(!scale) return "N/A";

  try {
    const reading = scale.reading;
    const math = scale.math;

    console.log(gt.readingTotal);
    console.log(scale.reading);
    console.log(scale.reading.filter( r=> r.correct == gt.readingTotal));

    const readingLower = reading.filter(r => r.correct == gt.readingTotal)[0].low;
    const readingHigher = reading.filter(r => r.correct == gt.readingTotal)[0].high;

    const mathLower = math.filter(r => r.correct == gt.mathTotal)[0].low;
    const mathHigher = math.filter(r => r.correct == gt.readingTotal)[0].high;

    const lower = parseInt(readingLower) + parseInt(mathLower);
    const higher = parseInt(readingHigher) + parseInt(mathHigher);

    return lower.toString() + " to " + higher.toString();
  } catch (error) {
    console.log(error);
  }
  return "N/A";
}

const frac = (a: number, b: number): string => {
  return ( (a / b) * 100 ).toPrecision(3).toString() + "%";
}
// category/type/section, correct, total, frac
// id, module, qNumber, studentAns, correctAns, correct, categories
export const buildCsv = (gt: GradedTest): string => {
  var rows = [];
  var res: string = "";

  rows.push(["question type", "correct", "total", "percentage"]);

  rows.push([
    "Overall",
    gt.overallTotal,
    gt.answers.length,
    frac(gt.overallTotal, gt.answers.length)
  ]);
  rows.push([
    "Reading",
    gt.readingTotal,
    gt.answers.filter(g => g.question.type == "reading").length,
    frac(gt.readingTotal, gt.answers.filter(g => g.question.type == "reading").length),
  ]);
  rows.push([
    "Math",
    gt.mathTotal,
    gt.answers.filter(g => g.question.type == "math").length,
    frac(gt.mathTotal, gt.answers.filter(g => g.question.type == "math").length),
  ]);

  rows.push(["","","",""]);
  rows.push(["section", "correct", "total", "percentage"]);

  gt.sectionResults.map((s, _) => {
    rows.push([s.section!, s.correct, s.total, frac(s.correct, s.total)]);
  });

  rows.push(["","","",""]);
  rows.push(["category", "correct", "total", "percentage"]);

  gt.categoryResults.map((c, _) => {
    rows.push([c.category!, c.correct, c.total, frac(c.correct, c.total)]);
  });

  rows.push(["","","",""]);
  rows.push(["section", "number", "response", "correct", "points", "categories"]);
  gt.answers.map((a, _) => {
    rows.push([
      a.question.section+1,
      a.question.qNumber,
      a.response ?
        (a.response.choice != null ? choiceLetters[a.response.choice] : a.response.freeResponseRaw)
      :
        "None",
      a.answer.choice != null ? choiceLetters[a.answer.choice] : a.answer.freeResponseRaw,
      a.correct ? "1" : "0",
      a.question.categories.join("_")
    ]);
  });

  console.log(rows);

  for (const row of rows) {
    res += row.join(",");
    res += "\n";
  }
  console.log(res);
  return res;
}
