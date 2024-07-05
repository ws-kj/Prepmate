import React, { useState, ChangeEvent, useEffect } from 'react';
import { Question } from './types';
import ChoiceLetter from './ChoiceLetter';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as bookmarkOutline } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as bookmarkSolid } from '@fortawesome/free-solid-svg-icons';

var Latex = require('react-latex');

interface QuestionViewProps {
  question: Question;
  handleAnswerEntry: (choiceIndex: number | null, freeResponse: string | null) => void;
  toggleMarked: (id: number) => void;
  isMarked: boolean;
  getPrevChoice: () => number | null;
  getPrevFreeResponse: () => string;
}

const QuestionView: React.FC<QuestionViewProps> =
    ({question, handleAnswerEntry, toggleMarked, isMarked, getPrevChoice, getPrevFreeResponse}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(getPrevChoice());
  const [freeResponseValue, setFreeResponseValue] = useState<string>('');

  const handleAnswerClick = (index: number): void => {
    if(index === selectedAnswer) {
      setSelectedAnswer(null);
      handleAnswerEntry(null, null);
    } else {
      setSelectedAnswer(index);
      handleAnswerEntry(index, null);
    }
  }

  const handleFrqChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFreeResponseValue(event.target.value);
    handleAnswerEntry(null, event.target.value);
  }

  useEffect(() => {
    setSelectedAnswer(getPrevChoice());
    setFreeResponseValue(getPrevFreeResponse());
  }, [question]);

  return (
    <div className="question-view">
      {question.passage != null &&
        <div className="panel passage-panel">
          <p className="passage">
            {question.passage}
          </p>
        </div>
      }
      <div className="panel question-panel">
        <div className="question-container">
          <div className="question-number-container">
            <div className="question-number">
              {question.qNumber}
            </div>
            <FontAwesomeIcon
              className={"mark-icon " + (isMarked ? "mark-icon-solid" : "")}
              icon={(isMarked ? bookmarkSolid : bookmarkOutline)}
              onClick={()=>{toggleMarked(question.id)}}
            />
            <p className="mark-label" onClick={()=>{toggleMarked(question.id)}}>Mark for Review</p>
          </div>
          <p className="question">
            <Latex>{question.question}</Latex>
          </p>
        </div>
        {question.choices != null ?
          <div className="choices-container">
            {question.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={selectedAnswer === index ? "choice-button selected" : "choice-button"}
              >
                <ChoiceLetter index={index} />
                <Latex>{choice}</Latex>
              </button>
            ))}
          </div>
        :
          <div className="frq-container">
            <input className="frq-input" value={freeResponseValue} onChange={handleFrqChange}/>
          </div>
        }
      </div>
    </div>
  );
}

export default QuestionView;
