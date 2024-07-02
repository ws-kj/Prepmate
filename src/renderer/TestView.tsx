import React, { useState, useEffect, ChangeEvent } from 'react';
import { Question, Answer, Test, TestConfig, Break } from './types';

import QuestionView from './QuestionView';
import TestHeader from './TestHeader';
import MidSection from './MidSection';

interface TestViewProps {
  config: TestConfig;
}

const TestView: React.FC<TestViewProps> = ({config}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(config.test.questions[0]);
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(config.test.questions.length).fill(null));
  const [inMidSection, setInMidSection] = useState<boolean>(false);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    console.log(config.test.questions);
    beginCountdown(10);
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if(prevSeconds == null || prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  const beginCountdown = (minutes: number, seconds: number | null = null) => {
    setSecondsLeft(minutes * 60 + (seconds ? seconds : 0));

  }

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
    if(currentQuestion.id == 0 ||
        config.test.questions[currentQuestion.id-1].section != currentQuestion.section) {
      return;
    }

    setCurrentQuestion(config.test.questions[currentQuestion.id-1]);
  }

  const handleNext = (): void => {
    if(currentQuestion.id >= config.test.questions.length-1) {
      return;
    }

    if(inMidSection || currentQuestion.section == config.test.questions[currentQuestion.id+1].section) {
      setCurrentQuestion(config.test.questions[currentQuestion.id+1]);
      setInMidSection(false);
    } else {
      if(config.breaks.some(b => b.prevSection == currentQuestion.section)) {
        alert("Break time!");
      } else {
        setInMidSection(true);
      }
    }
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
      <TestHeader
        section={currentQuestion.section}
        secondsLeft={secondsLeft}
      />
      { inMidSection ?
      <MidSection prevSection={currentQuestion.section}/>
      :
      <QuestionView
        question={currentQuestion}
        handleAnswerEntry={handleAnswerEntry}
        getPrevChoice={getPrevChoice}
        getPrevFreeResponse={getPrevFreeResponse}
      />
      }
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
