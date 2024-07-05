import React, { useState, useEffect } from 'react';
import { Question, Answer, Test, sectionTitles } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faLocationPin, faBookmark } from '@fortawesome/free-solid-svg-icons';

interface ReviewProps {
  section: number;
  test: Test;
  currentQ: number | null;
  marked: number[];
  fullpage: boolean;
  studentAnswers: (Answer | null)[];
  jumpToQuestion: (num: number) => void;
  togglePopup: () => void;
  jumpToReview: () => void;
}

const Review: React.FC<ReviewProps> = ({
  section,
  test,
  currentQ,
  marked,
  fullpage,
  studentAnswers,
  jumpToQuestion,
  togglePopup,
  jumpToReview
}) => {
  const [sectionTitle, setSectionTitle] = useState<string>(sectionTitles[section]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setQuestions(test.questions.filter(q => q.section == section));
  }, []);

  return (
    <div className={"review-page " + (fullpage ? "question-view" : "review-popup")}>
      <div className="review-header">
        { !fullpage &&
          <FontAwesomeIcon
            className="close-popup"
            icon={faClose}
            onClick={togglePopup} />
        }
        <p className="section-title">{sectionTitle}</p>
        <div className="icon-info">
          <div className="info-set">
            <FontAwesomeIcon className = "info-icon" icon={faLocationPin}/>
            Current
          </div>
          <div className="info-set">
            <div className="dash-icon"/>
            Unanswered
          </div>
          <div className="info-set">
            <FontAwesomeIcon className ="mark-info info-icon" icon={faBookmark}/>
            For Review
          </div>
        </div>
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
              {marked.some(n => n == q.id) &&
                <FontAwesomeIcon
                  className="qbox-mark"
                  icon={faBookmark}
                />
              }
              {q.qNumber}
            </div>
          );
        })}
        { !fullpage &&
        <div className="review-jump-container">
          <button className="review-jump"  onClick={jumpToReview}>
            Go to Review Page
          </button>
        </div>
        }
      </div>
    </div>
  );
}

export default Review;
