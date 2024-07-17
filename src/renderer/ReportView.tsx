import React, { useState, useEffect } from 'react';
import { gradeTest, GradedTest } from './grade';
import { TestConfig, choiceLetters } from './types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface ReportViewProps {
  gt: GradedTest;
}

const ReportView: React.FC<ReportViewProps> = ({gt}) => {
  useEffect(() => {

  }, []);

  const frac = (a: number, b: number): string => {
    return ( (a / b) * 100 ).toPrecision(3).toString() + "%";
  }

  return (
    <div className='report-view'>
      <div className='report-header'>
        <div className='back-container'>
          <div className='back-arrow'>
            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
          </div>
        </div>
        <div className='report-header-left'>
          <p><b>{gt.testName}</b></p>
          <p>Taken by {gt.studentName} on {gt.timestamp}</p>
        </div>
        <div className='report-header-right'>
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
                <td>{a.answer.choice ? choiceLetters[a.answer.choice] : a.answer.freeResponseRaw}</td>
                { a.response ?
                  <td>{a.response.choice ? choiceLetters[a.response.choice] : a.response.freeResponseRaw}</td>
                :
                  <td>None</td>
                }
                <td><button className='qview'>View</button></td>
              </tr>
              ))
            }
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportView;
