import React, { useState, useEffect } from 'react';
import { Question, Answer, sectionTitles } from './types';
import { parseTime } from './util';
import { faCalculator, faShapes, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TestHeaderProps {
  section: number | null;
  secondsLeft: number | null;
  inQuestion: boolean;
  inMath: boolean;
  hasPassage: boolean;
  toggleCalculator: () => void;
  toggleReference: () => void;
  openAnnotation: () => void;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  section, secondsLeft, inQuestion, inMath, hasPassage, toggleCalculator, toggleReference, openAnnotation
}) => {
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
        <div className="first-tool"></div>
        { inQuestion && inMath &&
        <div className="tool-button" onClick={toggleCalculator}>
          <FontAwesomeIcon icon={faCalculator} className="tool-icon"/>
          <p>Calculator</p>
        </div>
        }
        { inQuestion && inMath &&
        <div className="tool-button" onClick={toggleReference}>
          <FontAwesomeIcon icon={faShapes} className="tool-icon"/>
          <p>References</p>
        </div>
        }
        { inQuestion && !inMath && hasPassage &&
        <div className="tool-button" onClick={openAnnotation}>
          <FontAwesomeIcon icon={faPenToSquare} className="tool-icon"/>
          <p>Annotate</p>
        </div>
        }
        <div className="last-tool"></div>
      </div>
    </div>
  );
}

export default TestHeader;
