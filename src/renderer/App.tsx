import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

import TestView from './TestView';
import { Question, Test } from './types';
import { loadTest } from './test';

export default function App() {
  const [test, setTest] = useState<Test | null>(null);

  useEffect(() => {
    async function getTest() {
      const newtest = await loadTest("./tests/ExampleTest.csv");
      console.log(newtest);
      setTest(newtest)
    };
    if(!test) getTest();
  }, [test]);
  return (
    <Router>
      <Routes>
        <Route path="/" element=
          { test ? <TestView questions={test.questions} /> : <></> }
        />
      </Routes>
    </Router>
  );
}
