import React, { useState, ChangeEvent, useEffect, RefObject, ReactNode } from 'react';
import { ElectronHandler } from '../main/preload';
import { Question, Annotation } from './types';
import Choice from './Choice';
import './App.css';
import { Buffer } from 'buffer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as bookmarkOutline } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as bookmarkSolid, faClose } from '@fortawesome/free-solid-svg-icons';

var Latex = require('react-latex');


declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

interface AnnotationHighlightProps {
  passageText: string,
  annotation: Annotation,
  deleteAnnotation: (annotation: Annotation) => void;
}

const AnnotationHighlight: React.FC<AnnotationHighlightProps> = ({
  passageText,
  annotation,
  deleteAnnotation
}) => {
  const [showAnnotation, setShowAnnotation] = useState<boolean>(false);

  const toggleShow = () => {
    setShowAnnotation(!showAnnotation);
  }

  return(
    <span className="annotation-highlight" >
      <span onClick={toggleShow}>{passageText}</span>
      { showAnnotation &&
      <div className="annotation-popup">
        <div className="popup-text">{annotation.text}</div>
        <FontAwesomeIcon
          icon={faClose}
          className="close-annotation-popup"
          onClick={()=>deleteAnnotation(annotation)}
        />
      </div>
      }
    </span>
  );

}

interface QuestionViewProps {
  question: Question;
  annotations: Annotation[];
  imgPath: string | null;
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
  deleteAnnotation: (annotation: Annotation) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  annotations,
  imgPath,
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
  handlePassageSelection,
  deleteAnnotation
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(getPrevChoice());
  const [freeResponseValue, setFreeResponseValue] = useState<string>('');
  const [imgURL, setImgURL] = useState<string>('');

  const renderAnnotations = (text: string): ReactNode[] => {
    const list = [...annotations.filter(a => a.questionId == question.id)];
    //.sort((a, b) => a.start - b.start);
    const result: ReactNode[] = [];

    var pos = 0;
    var last = 0;
    /*
    for(const a of list) {
      if(a.start > pos) {
      result.push(text.slice(pos, a.start));
      }

      result.push(
        <span key={pos} className="annotation-highlight">
          {text.slice(a.start, a.end)}
        </span>
      );

      pos = a.end;
    }

    if(pos < text.length) {
      result.push(text.slice(pos));
    }
*/
    while(pos < text.length) {
      for(const a of list) {
        if(a.start == pos) {
          result.push(text.slice(last, a.start));
          result.push(
            <AnnotationHighlight
              key={pos}
              passageText={text.slice(a.start, a.end)}
              annotation={a}
              deleteAnnotation={deleteAnnotation}
            />
          );
          pos = a.end;
          last = a.end;
          break;
        }
      }
      pos++;
    }
    result.push(text.slice(last, text.length));

    return result;
  }

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

    const setImg = async () => {
      if(imgPath) {
        try {
          await window.electron.fileSystem.readFile(imgPath).then((file) => {
            setImgURL("file://" + imgPath);
          });
        } catch (error) {
          alert("Error loading question image.");
          console.log(error);
        }
      }
    }
    setImg();
  }, [question]);

  return (
    <div className="question-view">
      {question.passage != null &&
        <div className="panel passage-panel">
          <p className="passage"
            ref={passageRef}
            onMouseUp={handlePassageSelection}
            onKeyUp={handlePassageSelection}>
            {renderAnnotations(question.passage)}
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
          {imgPath && <img src={imgURL} className="question-image"/> }
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
