import React, { useState, useEffect } from 'react';
import { Question, Answer } from './types';

interface TestHeaderProps {
  section: number | null
}

const TestHeader: React.FC<TestHeaderProps> = ({section}) => {
  const [sectionTitle, setSectionTitle] = useState<string>('');

  useEffect(() => {
    switch(section) {
      case 0:
        setSectionTitle("Section 1, Module 1: Reading and Writing");
        break;
      case 1:
        setSectionTitle("Section 1, Module 2: Reading and Writing");
        break;
      case 3:
        setSectionTitle("Section 2, Module 1: Math");
        break;
      case 4:
        setSectionTitle("Section 2, Module 2: Math");
        break;
      default:
        break;
    }
  }, [section]);

  return (
    <div className="header">
      <div className="header-left">
        <p className="section-title">{sectionTitle}</p>
      </div>
      <div className="header-center">
      </div>
      <div className="header-right">
      </div>
    </div>
  );
}

export default TestHeader;
