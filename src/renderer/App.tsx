import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

import TestView from './TestView';
import ReportView from './ReportView';
import { Question, Test, TestConfig, Break } from './types';
import { loadTest } from './test';
import { GradedTest } from './grade';

import Home from './Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
  /*
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
  );*/
}
