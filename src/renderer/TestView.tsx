import React, { useState, ChangeEvent } from 'react';
import { Question, Answer } from './types';
import QuestionView from './QuestionView';

interface TestViewProps {
  questions: Question[];
}

const TestView: React.FC<TestViewProps> = ({questions}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(questions.length).fill(null));

  const handleAnswerEntry = (choiceIndex: number | null, freeResponse: string | null): void => {
    if(currentQuestion == null || currentQuestion.id >= answers.length) {
      return;
    }

    setAnswers(answers => ({...answers, [currentQuestion.id]:  {
      id: currentQuestion.id,
      choice: choiceIndex,
      freeResponseRaw: freeResponse
    }}));
  };

  const handleBack = (): void => {
    if(currentQuestion == null || currentQuestion.id == 0) {
      return;
    }

    setCurrentQuestion(questions[currentQuestion.id-1]);
  }

  const handleNext = (): void => {
    if(currentQuestion == null || currentQuestion.id >= questions.length-1) {
      return;
    }

    setCurrentQuestion(questions[currentQuestion.id+1]);
  }

  return (
    <div className="test-view">
      <div className="header">

      </div>
      <div className="question-container">
        { currentQuestion != null &&
          <QuestionView
            question={currentQuestion}
            handleAnswerEntry={handleAnswerEntry}
          />
        }
      </div>
      <div className="footer">
        <div className="nav-button-container">
          <button className="nav-button" onClick={handleBack}>Back</button>
          <button className="nav-button" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default TestView;
