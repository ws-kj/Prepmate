import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

import TestView from './TestView';
import { Question, Test, TestConfig, Break } from './types';
import { loadTest } from './test';

export default function App() {
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);

  useEffect(() => {
    async function getTest() {
      const newtest = await loadTest("./tests/Short.csv");
      if(!newtest) {
        alert("failed to load test from file");
        return;
      }

      const config: TestConfig = {
        test: newtest,
        sectionLengths: [5, 5, 5, 5],
        breaks: [{prevSection: 1, length: 5}],
        markedQuestions: [],
        images: []
      };
      setTestConfig(config);
    };
    if(!testConfig) getTest();
  }, [testConfig]);
  return (
    <Router>
      <Routes>
        <Route path="/" element=
          { testConfig ? <TestView config={testConfig} /> : <></> }
        />
      </Routes>
    </Router>
  );
}
