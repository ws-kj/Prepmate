import React, { useState, useEffect } from 'react';
import { gradeTest, GradedTest, GradedAnswer, buildCsv } from './grade';
import { Question, TestConfig, choiceLetters } from './types';
import { ChoiceLetter } from './Choice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';

var Latex = require('react-latex');

interface PopupChoiceProps {
  choice: string;
  index: number;
  selected: boolean;
  correct: boolean;
}

const PopupChoice: React.FC<PopupChoiceProps> = ({choice, index, selected, correct}) => {
  return (
    <div className="choice-container">
      <div className={
        "choice-button " +
        (correct ? "correct-choice " : "") +
        (!correct && selected ? "wrong-choice " : "")
      }>
        <ChoiceLetter index={index} />
        <Latex>{choice}</Latex>
      </div>
    </div>
  );
}

interface QuestionPopupProps {
  ga: GradedAnswer;
  togglePopup: () => void;
}

const QuestionPopup: React.FC<QuestionPopupProps> = ({ga, togglePopup}) => {

  useEffect(() => {}, [ga]);

  return (
    <div className="question-popup">
      <div className="qpopup-header">
        <p>Section {ga.question.section+1}, Question {ga.question.qNumber}</p>
        <FontAwesomeIcon icon={faClose} className="close-popup" onClick={togglePopup}/>
      </div>
      <div className="qpopup-body">
      {ga.question.passage != null &&
        <div className="popup-panel popup-passage">
          <p>{ga.question.passage}</p>
        </div>
      }
        <div className="popup-panel">
          <div className="question-container">
            <p className="question">
              <Latex>{ga.question.question}</Latex>
            </p>
          </div>
          {ga.question.choices != null &&
            <div className="choices-container">
              {ga.question.choices.map((c, i) => (
                <PopupChoice
                  key={i}
                  index={i}
                  choice={c}
                  selected={ga.response != null && ga.response.choice == i}
                  correct={ga.answer.choice == i}
                />
              ))}
              <p className="you-selected">
                You selected: <b>{(ga.response != null && ga.response.choice != null) ?
                  choiceLetters[ga.response.choice] : "None"}</b>
              </p>
              <p>
                The correct answer is: <b>{choiceLetters[ga.answer.choice!]}</b>
              </p>
            </div>
          }
          {ga.question.choices == null &&
            <div className="choices-container">
              <p className="you-selected">
                You answered: <b>{(ga.response != null && ga.response.freeResponseRaw != null) ?
                  ga.response.freeResponseRaw : "None"}</b>
              </p>
              <p>
                The correct answer is: <b>{ga.answer.freeResponseRaw!}</b>
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

interface ReportViewProps {
  gt: GradedTest;
}

const ReportView: React.FC<ReportViewProps> = ({gt}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupGA, setPopupGA] = useState<GradedAnswer | null>(null);

  const openPopup = (ga: GradedAnswer) => {
    setPopupGA(ga);
    setShowPopup(true);
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  const frac = (a: number, b: number): string => {
    return ( (a / b) * 100 ).toPrecision(3).toString() + "%";
  }

  const downloadCSV = (e) => {
    console.log("E");
    const csv = buildCsv(gt);
    const element = document.createElement("a");
    const f = new Blob([csv], {type: "text/plain"});
    element.href = URL.createObjectURL(f);
    element.download = gt.testName + "_" + gt.studentName + "_" + gt.timestamp + ".csv";
    element.click();
  }

  return (
    <div className='report-view'>
      <div className='report-header'>
        <div className='back-container'>
          <div className='back-arrow'>
            <FontAwesomeIcon icon={faArrowLeft}className="back-icon" />
          </div>
        </div>
        <div className='report-header-left'>
          <p><b>{gt.testName}</b></p>
          <p>Taken by {gt.studentName} on {gt.timestamp}</p>
        </div>
        <div className='report-header-right'>
          <button className="view-answers" onClick={downloadCSV}>  Download CSV </button>
        </div>
      </div>
      <div className='report-body'>
        <div className='report-summary'>
          <p className="summary-title">Summary</p>
          <div className='summary-section'>
            <div className='summary-section-header'>Total Score</div>
            <div className='summary-section-body'>
              <p className='total-score'>0000</p>
              <p>Raw: {gt.overallTotal} / {gt.answers.length} ({frac(gt.overallTotal, gt.answers.length)})</p>
              <p>
                Reading: {gt.readingTotal} / {gt.answers.filter(g => g.question.type == "reading").length}
                &nbsp; ({frac(gt.readingTotal, gt.answers.filter(g => g.question.type == "reading").length)})
              </p>
              <p>
                Math: {gt.mathTotal} / {gt.answers.filter(g => g.question.type == "math").length}
                &nbsp; ({frac(gt.mathTotal, gt.answers.filter(g => g.question.type == "math").length)})
              </p>
            </div>
          </div>
          <div className='summary-section'>
            <div className='summary-section-header'>Section Scores</div>
            <div className='summary-section-body'>
            {
              gt.sectionResults.map((s, _) => (
                <p>Section {s.section!}: {s.correct} / {s.total} ({frac(s.correct, s.total)})</p>
              ))
            }
            </div>
          </div>
          <div className='summary-section'>
            <div className='summary-section-header'>Category Scores</div>
            <div className='summary-section-body'>
            {
              gt.categoryResults.map((c, _) => (
                <p>{c.category!}: {c.correct} / {c.total} ({frac(c.correct, c.total)})</p>
              ))
            }
            </div>
          </div>
        </div>
        <div className='report-summary answers-body'>
          <p className='summary-title'>Answers</p>
          <div className='summary-section-body'>
            <table className='answers-table'>
              <thead className='table-header'>
                <th>Section</th>
                <th>#</th>
                <th>Correct</th>
                <th>Response</th>
                <th className='view-header'>View</th>
              </thead>
              <tbody>
            {
              gt.answers.map((a, _) => (
              <tr className='answer-container'>
                <td>{a.question.section+1}</td>
                <td>{a.question.qNumber}</td>
                <td>{a.answer.choice != null ? choiceLetters[a.answer.choice] : a.answer.freeResponseRaw}</td>
                { a.response ?
                  <td className={a.correct ? "tr-correct" : "tr-wrong"}>
                    {a.response.choice != null ? choiceLetters[a.response.choice] : a.response.freeResponseRaw}
                  </td>
                :
                  <td className="tr-wrong">None</td>
                }
                <td><button className='qview' onClick={()=>{openPopup(a)}}>View</button></td>
              </tr>
              ))
            }
            </tbody>
          </table>
          </div>
        </div>
      </div>
      {showPopup && popupGA != null &&
        <QuestionPopup ga={popupGA} togglePopup={togglePopup} />
      }
    </div>
  );
}

export default ReportView;
