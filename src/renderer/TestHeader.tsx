import React, { useState, useEffect } from 'react';
import { Question, Answer, sectionTitles } from './types';
import { parseTime } from './util';

interface TestHeaderProps {
  section: number | null,
  secondsLeft: number | null,
  inQuestion: boolean
}

const TestHeader: React.FC<TestHeaderProps> = ({section, secondsLeft, inQuestion}) => {
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [showTime, setShowTime] = useState<boolean>(true);

  useEffect(() => {
    if(section != null && 0 <= section && section <= 3) {
      setSectionTitle(sectionTitles[section]);
    }
  }, [section]);

  const toggleTime = () => {
    setShowTime(!showTime);
  }

  return (
    <div className="header">
      <div className="header-left">
        {inQuestion &&
        <p className="section-title">{sectionTitle}</p>
        }
      </div>
      <div className="header-center">
        {showTime && secondsLeft ?
          <div className="timer-container">
            <p className="timer">{parseTime(secondsLeft)}</p>
            <button className="toggle-timer" onClick={toggleTime}>Hide</button>
          </div>
        :
          <div className="toggle-container">
            <button className="toggle-timer show-time" onClick={toggleTime}>Show Time</button>
          </div>
        }
      </div>
      <div className="header-right">
      </div>
    </div>
  );
}

export default TestHeader;
