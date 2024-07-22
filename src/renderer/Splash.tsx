import React from 'react';
import { TestConfig } from './types';
import { GradedTest } from './grade';

interface SplashProps {
  config: TestConfig;
  backToHome: () => void;
  toggleSplash: () => void;
}

const Splash: React.FC<SplashProps> = ({config, backToHome, toggleSplash}) => {
  return (
    <div className="splash">
      <div className="splash-body">
        <p>You are about to take <b>{config.testName}</b>.</p>
        <p>When you're ready, click "Begin Test."</p>
        <div className="splash-buttons">
          <button className="splash-back" onClick={backToHome}>Cancel</button>
          <button className="splash-begin" onClick={toggleSplash}>Begin Test</button>
        </div>
      </div>
    </div>
  );
}

export default Splash;
