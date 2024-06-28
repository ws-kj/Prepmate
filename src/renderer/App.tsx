import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

import TestView from './TestView';
import { Question } from './types';
import { loadTest } from './test';

export default function App() {

  var example_test: Question[] = [
    {
      id: 0,
      section: 0,
      type: "math",
      passage: null,
      question: "what is 1 + 1?",
      choices: ["1", "2", "3", "4"],
      categories: []
    },
    {
      id: 1,
      section: 1,
      type: "math",
      passage: null,
      question: "what is $(3 \\times 4) \\div (5-3)$?",
      choices: null,
      categories: [],
    },
    {
      id: 2,
      section: 3,
      type: "reading",
      passage: "To be or not to be, that is the...",
      question: "what word best completes the passage?",
      choices: ["cat", "question", "man", "word"],
      categories: []
    },
    {
      id: 3,
      section: 4,
      type: "reading",
      passage: "infinite words!aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      question: "what word best completes the passage?",
      choices: ["cat", "question", "man", "word"],
      categories: [],
    },
  ];

  loadTest("tests/ExampleTest.csv");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestView questions={example_test}/>} />
      </Routes>
    </Router>
  );
}
