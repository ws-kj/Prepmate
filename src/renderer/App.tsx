import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

import TestView from './TestView';
import ReportView from './ReportView';
import { Question, Test, TestConfig, Break } from './types';
import { loadTest } from './test';
import { GradedTest } from './grade';

export default function App() {
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [gradedTest, setGradedTest] = useState<GradedTest | null>(null);

  const openTestView = (gt: GradedTest, config: TestConfig) => {
    setTestConfig(config);
    setGradedTest(gt);
  }

  useEffect(() => {
    async function getTest() {
      const newtest = await loadTest("./tests/Short.csv");
      if(!newtest) {
        alert("failed to load test from file");
        return;
      }

      const config: TestConfig = {
        testName: "Example Test",
        studentName: "Student",
        test: newtest,
        sectionLengths: [5, 5, 5, 5],
        breaks: [{prevSection: 1, length: 5}],
        images: [],
        scoreScalePath: "",
      };
      setTestConfig(config);
    };
    if(!testConfig) getTest();
  }, [testConfig]);
  return (
    <Router>
      <Routes>
        { testConfig && !gradedTest &&
        <Route path="/" element={<TestView config={testConfig} openTestView={openTestView} />} />
        }
        { gradedTest && testConfig &&
        <Route path="/" element={<ReportView gt={gradedTest} />} />
        }
      </Routes>
    </Router>
  );
}
