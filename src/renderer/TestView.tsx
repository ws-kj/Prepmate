import React, { useState, useEffect, ChangeEvent } from 'react';
import { Question, Answer, Test, TestConfig, Break } from './types';

import QuestionView from './QuestionView';
import TestHeader from './TestHeader';
import MidSection from './MidSection';
import BreakView from './BreakView';

import { findLastIndex } from './util';

interface TestViewProps {
  config: TestConfig;
}

const TestView: React.FC<TestViewProps> = ({config}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(config.test.questions[0]);
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(config.test.questions.length).fill(null));

  const [inMidSection, setInMidSection] = useState<boolean>(false);
  const [inBreak, setInBreak] = useState<boolean>(false);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const [canClickNext, setCanClickNext] = useState<boolean>(true);
  const [canClickBack, setCanClickBack] = useState<boolean>(true);

  useEffect(() => {
    console.log(config.test.questions);
    beginCountdown(config.sectionLengths[0]);
  }, []);

  useEffect(() => {
    setCanClickNext(!inBreak && currentQuestion.id < config.test.questions.length-1);

    if(inMidSection) {
      setCanClickBack(true);
    } else {
      setCanClickBack(!inBreak && currentQuestion.id != 0 &&
        config.test.questions[currentQuestion.id-1].section == currentQuestion.section);

      if(config.breaks.some(b => b.prevSection == currentQuestion.section) &&
        config.test.questions[currentQuestion.id+1].section != currentQuestion.section) {
        setCanClickNext(false);
      }
    }
  }, [currentQuestion, inBreak, inMidSection]);

  const handleCountdownEnd = () => {
    const s = currentQuestion.section;

    if(inBreak) {
      const newTime = config.sectionLengths[config.test.questions[currentQuestion.id+1].section];
      beginCountdown(newTime);
      setCurrentQuestion(config.test.questions[currentQuestion.id+1]);
      setInBreak(false);
      return;
    }

    if(currentQuestion.id == config.test.questions.length-1) {
      alert("Test grading not yet implemented");
      return;
    }

    const nextBreak = config.breaks.some(b => b.prevSection == s);
    console.log(currentQuestion);
    if(nextBreak) {
      beginBreak();
    } else {
      const newIdx = findLastIndex<Question>(config.test.questions, q => q.section == s)+1;
      console.log(newIdx);
      const newTime = config.sectionLengths[config.test.questions[newIdx].section];
      beginCountdown(newTime);
      setInMidSection(false);
      setCurrentQuestion(config.test.questions[newIdx]);
    }
  }


  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if(prevSeconds == null || prevSeconds <= 1) {
          handleCountdownEnd();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleCountdownEnd]);


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
    if(inMidSection && secondsLeft != 0) {
      setInMidSection(false);
      return;
    }

    if(!canClickBack) {
      return;
    }

    setCurrentQuestion(config.test.questions[currentQuestion.id-1]);
  }

  const handleNext = (): void => {
    if(!canClickNext) {
      return;
    }

    if(inMidSection || currentQuestion.section == config.test.questions[currentQuestion.id+1].section) {
      const newTime = config.sectionLengths[config.test.questions[currentQuestion.id+1].section];
      beginCountdown(newTime);
      setCurrentQuestion(config.test.questions[currentQuestion.id+1]);
      setInMidSection(false);
    } else {
      if(!config.breaks.some(b => b.prevSection == currentQuestion.section)) {
        setInMidSection(true);
      }
    }
  }

  const beginBreak = () => {
    const currentBreak = config.breaks.find(b => b.prevSection == currentQuestion.section);
    setInBreak(true);
    if(!currentBreak) return;
    beginCountdown(currentBreak.length);
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
        inQuestion={(!inBreak && !inMidSection)}
      />
      { inMidSection &&
      <MidSection prevSection={currentQuestion.section}/>
      }
      { inBreak && secondsLeft &&
      <BreakView secondsLeft={secondsLeft} />
      }
      { !inMidSection && !inBreak &&
      <QuestionView
        question={currentQuestion}
        handleAnswerEntry={handleAnswerEntry}
        getPrevChoice={getPrevChoice}
        getPrevFreeResponse={getPrevFreeResponse}
      />
      }
      <div className="footer">
        {! inBreak &&
        <div className="nav-button-container">
          <button
            className={"nav-button " + (!canClickBack ? 'nav-disabled' : '')}
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className={"nav-button " + (!canClickNext ? 'nav-disabled' : '')}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
        }
      </div>
    </div>
  );
}

export default TestView;
