import React, { useState, ChangeEvent, useEffect } from 'react';
import { Question } from './types';
import './App.css';


var Latex = require('react-latex');

interface QuestionViewProps {
  question: Question;
  handleAnswerEntry: (choiceIndex: number | null, freeResponse: string | null) => void;
  getPrevChoice: () => number | null;
  getPrevFreeResponse: () => string;
}

const QuestionView: React.FC<QuestionViewProps> =
    ({question, handleAnswerEntry, getPrevChoice, getPrevFreeResponse}) => {
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
      {question.type == "reading" &&
        <div className="panel passage-panel">
          <p className="passage">
            {question.passage}
          </p>
        </div>
      }
      <div className="panel question-panel">
        <div className="question-container">
          <p className="question">
            {question.type == "reading" ?
              question.question
            :
              <Latex>{question.question}</Latex>
            }
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
                {choice}
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
