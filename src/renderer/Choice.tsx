import React, { useState, ChangeEvent, useEffect } from 'react';
import { Question } from './types';

var Latex = require('react-latex');

interface ChoiceLetterProps {
  index: number;
};

const ChoiceLetter: React.FC<ChoiceLetterProps> = ({index}) => {
  const [letterValue, setLetterValue] = useState<string>("A");

  useEffect(() => {
    switch(index) {
      case 1:
        setLetterValue("B");
        break;
      case 2:
        setLetterValue("C");
        break;
      case 3:
        setLetterValue("D");
        break;
      default:
      break;
    }
  }, []);

  return (
    <div className="choice-letter">
      {letterValue}
    </div>
  );
}


interface CrossoutProps {
  questionId: number,
  index: number;
  isSelected: boolean;
  toggleChoiceCrossout: (questionId: number, choice: number) => void;
  getCrossoutState: (questionId: number, choice: number) => boolean;
};

const Crossout: React.FC<CrossoutProps> = ({
  questionId,
  index,
  isSelected,
  toggleChoiceCrossout,
  getCrossoutState
}) => {
  const [letterValue, setLetterValue] = useState<string>("A");
  const [isCrossed, setIsCrossed] = useState<boolean>(getCrossoutState(questionId, index));

  useEffect(() => {
    setIsCrossed(getCrossoutState(questionId, index));
  }, [questionId, index]);

  const toggleLocalCrossout = () => {
    if(isSelected) return;
    toggleChoiceCrossout(questionId, index);
    setIsCrossed(!isCrossed);
  }

  useEffect(() => {
    switch(index) {
      case 1:
        setLetterValue("B");
        break;
      case 2:
        setLetterValue("C");
        break;
      case 3:
        setLetterValue("D");
        break;
      default:
      break;
    }
  }, []);

  return (
    <div className="crossout-container">
      { !isCrossed ?
      <div
        className="choice-letter choice-crossout"
        onClick={toggleLocalCrossout}
      >
        {letterValue}
        <div className="strikethrough"></div>
      </div>
      :
      <p className="undo-crossout" onClick={toggleLocalCrossout}>
        Undo
      </p>
      }
    </div>
  );
}


interface ChoiceProps {
  questionId: number;
  index: number;
  handleAnswerClick: (index: number) => void;
  choice: string;
  selectedAnswer: number | null;
  showCrossout: boolean;
  toggleChoiceCrossout: (questionId: number, choice: number) => void;
  getCrossoutState: (questionId: number, choice: number) => boolean;
}

const Choice: React.FC<ChoiceProps> = ({
  questionId,
  index,
  handleAnswerClick,
  choice,
  selectedAnswer,
  showCrossout,
  toggleChoiceCrossout,
  getCrossoutState
}) => {
  return (
    <div className="choice-container">
      <button
        key={index}
        onClick={() => {
          if(!showCrossout || !getCrossoutState(questionId, index)) {
            if(getCrossoutState(questionId, index)) {
              toggleChoiceCrossout(questionId, index);
            }
            handleAnswerClick(index);
          }
        }}
        className={
          "choice-button " +
          (selectedAnswer === index ? "selected" : "") +
          (showCrossout && getCrossoutState(questionId, index) ? "choice-disabled" : "")
        }
      >
        <ChoiceLetter index={index} />
        <Latex>{choice}</Latex>
        { showCrossout && getCrossoutState(questionId, index) &&
          <div className="button-strikethrough"></div>
        }
      </button>
      { showCrossout &&
      <Crossout
        questionId={questionId}
        index={index}
        isSelected={selectedAnswer === index}
        toggleChoiceCrossout={toggleChoiceCrossout}
        getCrossoutState={getCrossoutState}
      />
      }
    </div>
  );
}

export default Choice;
