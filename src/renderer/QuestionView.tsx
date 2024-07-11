import React, { useState, ChangeEvent, useEffect, RefObject } from 'react';
import { Question } from './types';
import Choice from './Choice';
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
  passageRef: RefObject<HTMLParagraphElement>;
  getPrevChoice: () => number | null;
  getPrevFreeResponse: () => string;
  showCrossout: boolean,
  showCalculator: boolean,
  setShowCrossout: (value: boolean) => void;
  toggleChoiceCrossout: (questionId: number, choice: number) => void;
  getCrossoutState: (questionId: number, choice: number) => boolean;
  handlePassageSelection: () => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  handleAnswerEntry,
  toggleMarked,
  isMarked,
  passageRef,
  getPrevChoice,
  getPrevFreeResponse,
  showCrossout,
  showCalculator,
  setShowCrossout,
  toggleChoiceCrossout,
  getCrossoutState,
  handlePassageSelection
}) => {
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

  const toggleCrossout = () => {
    setShowCrossout(!showCrossout);
  }

  useEffect(() => {
    setSelectedAnswer(getPrevChoice());
    setFreeResponseValue(getPrevFreeResponse());
  }, [question]);

  return (
    <div className="question-view">
      {question.passage != null &&
        <div className="panel passage-panel">
          <p className="passage"
            ref={passageRef}
            onMouseUp={handlePassageSelection}
            onKeyUp={handlePassageSelection}>
            {question.passage}
          </p>
        </div>
      }
      <div className={"panel calculator-panel " + ((!showCalculator) ? "calc-hidden" : "")}>
        <iframe className="calculator" src="https://www.desmos.com/testing/cb-digital-sat/graphing"/>
      </div>
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
            <div
              className={"toggle-crossout " + (showCrossout ? "toggle-crossout-on" : "")}
              onClick={toggleCrossout}
            >
              <p>ABC</p>
            </div>
          </div>
          <p className="question">
            <Latex>{question.question}</Latex>
          </p>
        </div>
        {question.choices != null ?
          <div className="choices-container">
            {question.choices.map((choice, index) => (
              <Choice
                key={index}
                questionId={question.id}
                index={index}
                choice={choice}
                handleAnswerClick={handleAnswerClick}
                selectedAnswer={selectedAnswer}
                showCrossout={showCrossout}
                toggleChoiceCrossout={toggleChoiceCrossout}
                getCrossoutState={getCrossoutState}
              />
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
