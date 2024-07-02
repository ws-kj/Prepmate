import React, { useState, useEffect } from 'react';
import { Question, Answer, sectionTitles } from './types';
import { parseTime } from './util';

interface BreakViewProps {
  secondsLeft: number;
}

const BreakView: React.FC<BreakViewProps> = ({secondsLeft}) => {
  return (
    <div className="question-view">
      <div className="mid-section">
        <h2>Take a break.</h2>
        <p>You may leave the room, but do not disturb students who are still testing.</p>
        <p>Do not exit the app or close your laptop.</p>
        <h3>Remaining break time:</h3>
        <p className="break-timer">{parseTime(secondsLeft)}</p>
      </div>
    </div>
  );
};

export default BreakView;
