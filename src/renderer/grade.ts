import { Question, Answer, Test } from './types';

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
  answers: GradedAnswer[];
  sectionResults: BlockResult[];
  categoryResults: BlockResult[];
}

export const gradeTest = (test: Test, responses: (Answer | null)[]): GradedTest => {
  var result: GradedTest = {
    answers: [],
    sectionResults: [],
    categoryResults: []
  };

  test.questions.forEach((q, i) => {
    const a = test.answers[i];
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

  return result;
}

export const convertToScore = (test: GradedTest): number => {

}
