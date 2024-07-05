import React, { useState, useEffect } from 'react';
import { Question, Answer, Test, sectionTitles } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faLocationPin } from '@fortawesome/free-solid-svg-icons';

interface ReviewProps {
  section: number;
  test: Test;
  currentQ: number | null;
  fullpage: boolean;
  studentAnswers: (Answer | null)[];
  jumpToQuestion: (num: number) => void;
  togglePopup: () => void;
}

const Review: React.FC<ReviewProps> =
    ({ section, test, currentQ, fullpage, studentAnswers, jumpToQuestion, togglePopup }) => {
  const [sectionTitle, setSectionTitle] = useState<string>(sectionTitles[section]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setQuestions(test.questions.filter(q => q.section == section));
  }, []);

  return (
    <div className={"review-page " + (fullpage ? "question-view" : "review-popup")}>
      <div className="review-header">
        <p className="section-title">{sectionTitle}</p>
        { !fullpage &&
          <FontAwesomeIcon
            className="close-popup"
            icon={faClose}
            onClick={togglePopup} />
        }
      </div>
      <div className="question-boxes">
        {questions.map((q, i) => {
          const answered = (studentAnswers[q.id] != null);
          return (
            <div
              className={"question-box " + (answered ? "answered" : "")}
              onClick={() => {jumpToQuestion(q.id)}}
            >
              {q.qNumber == currentQ &&
                <FontAwesomeIcon
                  className="current-pin"
                  icon={faLocationPin}
                />
              }
              {q.qNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Review;
