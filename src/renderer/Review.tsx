import React, { useState, useEffect } from 'react';
import { Question, Answer, Test, sectionTitles } from './types';

interface ReviewProps {
  section: number,
  test: Test,
  studentAnswers: (Answer | null)[],
  jumpToQuestion: (num: number) => void
}

const Review: React.FC<ReviewProps> = ({section, test, studentAnswers, jumpToQuestion}) => {
  const [sectionTitle, setSectionTitle] = useState<string>(sectionTitles[section]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setQuestions(test.questions.filter(q => q.section == section));
  }, []);

  return (
    <div className="question-view review-page">
      <div className="review-header">
        <p className="section-title">{sectionTitle}</p>
      </div>
      <div className="question-boxes">
        {questions.map((q, i) => {
          const answered = (studentAnswers[q.id] != null);
          return (
            <div
              className={"question-box " + (answered ? "answered" : "")}
              onClick={() => {jumpToQuestion(q.id)}}
            >
              {q.qNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Review;
