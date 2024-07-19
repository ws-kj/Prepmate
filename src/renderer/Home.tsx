// we need :
// load test from config file
// create test config file
// view completed test file

import React, { useState, uesEffect } from 'react';

import { GradedTest } from './grade';
import { TestConfig } from './types';
import TestView from './TestView';
import ReportView from './ReportView';

interface HomeProps {

};

const Home: React.FC<HomeProps> = ({}) => {
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [gradedTest, setGradedTest] = useState<GradedTest | null>(null);

  const handleStartTest = () => {
  }

  const handleConfigureTest = () => {
  }

  const handleViewTest = () => {
  }

  const openTestView = (gt: GradedTest, config: TestConfig) => {
    setTestConfig(config);
    setGradedTest(gt);
  }

  return (
    <div className="app-container">
      { !testConfig && !gradedTest &&
      <div className="home">
        <div className="title-splash">
          <p className="app-title">MLS Prepmate</p>
        </div>
        <div className="options">
          <div className="option-card" onClick={handleStartTest}>
            <p>Start Test</p>
          </div>
          <div className="option-card" onClick={handleConfigureTest}>
            <p>Configure New Test</p>
          </div>
          <div className="option-card" onClick={handleViewTest}>
            <p>View Graded Test</p>
          </div>
        </div>
      </div>
      }
      { testConfig && !gradedTest &&
      <TestView config={testConfig} openTestView={openTestView} />
      }
      { gradedTest && testConfig &&
      <ReportView gt={gradedTest} />
      }
    </div>
  );
}
