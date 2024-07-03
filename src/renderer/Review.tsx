import React, { useState, useEffect } from 'react';
import { Question, Test, sectionTitles } from './types';

interface ReviewProps {
  section: number,
  test: Test,
  jumpToQuestion: (num: number) => void
}

const Review: React.FC<ReviewProps> = ({section, test, jumpToQuestion}) => {
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
          const answered = (test.answers[q.id] != null);
          return (
            <div
              className={"question-box " + answered ? "answered" : ""}
              onClick={() => {jumpToQuestion(q.id)}}
            >
              <p>{q.qNumber}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Review;
