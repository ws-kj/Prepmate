import React, { useState, useEffect, ChangeEvent } from 'react';
import { Question, Answer, Test } from './types';
import QuestionView from './QuestionView';
import TestHeader from './TestHeader';

interface TestViewProps {
  test: Test;
}

const TestView: React.FC<TestViewProps> = ({test}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(test.questions[0]);
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(test.questions.length).fill(null));

  useEffect(() => {
    console.log(test.questions);
  }, []);

  const handleAnswerEntry = (choiceIndex: number | null, freeResponse: string | null): void => {
    if(currentQuestion.id >= answers.length) {
      return;
    }

    setAnswers(answers => ({...answers, [currentQuestion.id]:  {
      id: currentQuestion.id,
      choice: choiceIndex,
      freeResponseRaw: freeResponse
    }}));
  };

  const handleBack = (): void => {
    if(currentQuestion.id == 0) {
      return;
    }

    setCurrentQuestion(test.questions[currentQuestion.id-1]);
  }

  const handleNext = (): void => {
    if(currentQuestion.id >= test.questions.length-1) {
      return;
    }

    setCurrentQuestion(test.questions[currentQuestion.id+1]);
  }

  const getPrevChoice = (): number | null => {
    var answer: Answer | null = answers[currentQuestion.id];
    if(answer != null) return answer.choice;
    return null;
  }

  const getPrevFreeResponse = (): string => {
    var answer: Answer | null = answers[currentQuestion.id];
    if(answer != null && answer.freeResponseRaw != null) return answer.freeResponseRaw;
    return '';
  }

  return (
    <div className="test-view">
      <TestHeader section={currentQuestion.section}/>
      <QuestionView
        question={currentQuestion}
        handleAnswerEntry={handleAnswerEntry}
        getPrevChoice={getPrevChoice}
        getPrevFreeResponse={getPrevFreeResponse}
      />
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
