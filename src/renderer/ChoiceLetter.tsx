import React, { useState, useEffect } from 'react';
import './App.css';

interface ChoiceLetterProps {
  index: number;
};

const ChoiceLetter: React.FC<ChoiceLetterProps> = ({index}) => {
  const [letterValue, setLetterValue] = useState<string>("A");

  useEffect(() => {
    switch(index) {
      case 1:
        setLetterValue("B");
        break;
      case 2:
        setLetterValue("C");
        break;
      case 3:
        setLetterValue("D");
        break;
      default:
      break;
    }
  }, []);

  return (
    <div className="choice-letter">
      {letterValue}
    </div>
  );
}

export default ChoiceLetter;
