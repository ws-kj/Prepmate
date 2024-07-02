import React, { useState, useEffect } from 'react';
import { sectionTitles } from './types';

interface MidSectionProps {
  prevSection: number;
}

const MidSection: React.FC<MidSectionProps> = ({prevSection}) => {
  return (
    <div className="question-view">
      <div className="mid-section">
        <p>You have just completed</p>
        <p className="section-title">{sectionTitles[prevSection]}</p>
        <p>Click next to begin</p>
        <p className="section-title">{sectionTitles[prevSection+1]}</p>
      </div>
    </div>
  );
};

export default MidSection;
