import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

import TestView from './TestView';
import { Question } from './types';

export default function App() {

  var example_test: Question[] = [
    {
      id: 0,
      type: "math",
      passage: null,
      question: "what is 1 + 1?",
      choices: ["1", "2", "3", "4"]
    },
    {
      id: 1,
      type: "math",
      passage: null,
      question: "what is $(3 \\times 4) \\div (5-3)$?",
      choices: null
    },
    {
      id: 2,
      type: "reading",
      passage: "To be or not to be, that is the...",
      question: "what word best completes the passage?",
      choices: ["cat", "question", "man", "word"]
    },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestView questions={example_test}/>} />
      </Routes>
    </Router>
  );
}
