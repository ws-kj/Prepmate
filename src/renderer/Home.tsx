// we need :
// load test from config file
// create test config file
// view completed test file

import React, { useState, uesEffect } from 'react';

import { GradedTest, ScoreScale, loadScoreScale } from './grade'
import { loadTest } from './test';

import { TestConfig, Break, Test, ImageSrc } from './types';
import TestView from './TestView';
import ReportView from './ReportView';
import Splash from './Splash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faGear, faListCheck, faClose } from '@fortawesome/free-solid-svg-icons';

interface ConfigMenuProps {
  setTestConfig: (config: TestConfig) => void;
  toggleConfigMenu: () => void;
};

const ConfigMenu: React.FC<ConfigMenuProps> = ({setTestConfig, toggleConfigMenu}) => {
  const [testPath, setTestPath] = useState<string>('');
  const [scalePath, setScalePath] = useState<string>('');
  const [imgPaths, setImgPaths] = useState<string[]>([]);
  const [testName, setTestName] = useState<string>('');
  const [secLenText, setSecLenText] = useState<string>('');
  const [breakText, setBreakText] = useState<string>('');

  const handleSaveConfig = async () => {
    try {
      const sectionLengths = secLenText.split(',').map(s=>parseInt(s.trim()));

      const breakArrs = breakText.split(',').map(s => s.split(';').map(b => b.trim()));
      var breaks: Break[] = [];
      breakArrs.forEach(b => breaks.push({ prevSection: parseInt(b[0])-1, length: parseInt(b[1]) }));

      const srcChunks = imgPaths.map(s => s.split('_'));
      const images: ImageSrc[] = [];
      srcChunks.forEach(s => images.push({
        section: parseInt(s[1])-1,
        qNum: parseInt(s[2]),
        path: s.join('_')
      }));
      console.log(images);

      const test = await loadTest(testPath);
      if(!test) {
        alert("Failed to load test from file!");
        return;
      }

      const scale = await loadScoreScale(scalePath);
      console.log(scale);

      const config: TestConfig = {
        testName: testName,
        studentName: "",
        test: test,
        sectionLengths: sectionLengths,
        breaks: breaks,
        images: images,
        scoreScale: scale
      };
      console.log(config);

      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(config)], {type: "text/plain"});
      element.href = URL.createObjectURL(file);
      element.download = testName + "_Config.prepmate";
      element.click();
    } catch (error) {
      alert("Invalid config input!");
      return;
    }
  }

  return (
    <div className="config-builder question-popup">
      <div className="qpopup-header">
        <p>Configure Test</p>
        <FontAwesomeIcon icon={faClose} className="close-popup" onClick={toggleConfigMenu}/>
      </div>
      <div className="config-builder-body">
        <label>Test name</label>
        <input
          type="text"
          value={testName}
          onChange={(e)=>setTestName(e.target.value)}
        />
        <label>Test CSV</label>
        <input
          type="file"
          className="file-input"
          onChange={(e)=>{setTestPath(e.target.files![0].path)}}
        />
        <label>Score Scale CSV</label>
        <input
          type="file"
          className="file-input"
          onChange={(e)=>{setScalePath(e.target.files![0].path)}}
        />
        <label>Section lengths (For full-length SAT: "32, 32, 35, 35")</label>
        <input
          type="text"
          value={secLenText}
          onChange={(e)=>setSecLenText(e.target.value)}
        />
        <label>Breaks (For full-length SAT: "2; 10")</label>
        <input
          type="text"
          value={breakText}
          onChange={(e)=>setBreakText(e.target.value)}
        />
        <label>
          Question images
        </label>
        <label><i>
          Format names as name_section_question.png
          (ex: "mytest_3_5.png", "mytest_2_12.png")
        </i></label>
        <input
          type="file"
          className="file-input"
          multiple
          accept="image/png"
          onChange={(e)=>setImgPaths([...e.target.files!].map((f: any) => f.path))}
        />
        <button
          type="submit"
          onClick={handleSaveConfig}
        >
          Save Config
        </button>
      </div>
    </div>
  );
}
interface HomeProps {};

// <input type="file" onChange={(e)=>{setConfigfile(e.target.files[0]); console.log(e.target.files[0])}}/>

const Home: React.FC<HomeProps> = ({}) => {
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [gradedTest, setGradedTest] = useState<GradedTest | null>(null);

  const [showConfigMenu, setShowConfigMenu] = useState<boolean>(false);

  const [configFile, setConfigFile] = useState<File | null>(null);
  const [gradedFile, setGradedFile] = useState<File | null>(null);

  const [showSplash, setShowSplash] = useState<boolean>(false);

  const toggleSplash = () => {
    setShowSplash(!showSplash);
  }

  const toggleConfigMenu = () => {
    setShowConfigMenu(!showConfigMenu);
  }

  const backToHome = () => {
    setTestConfig(null);
    setGradedTest(null);
  }

  const handleStartTest = async () => {
    try {
      const element = document.createElement("input");
      element.type = "file";
      element.addEventListener('change', async (e) => {
        const target = e.target as HTMLInputElement;
        if(target.files) {
          setConfigFile(target.files[0]);
          console.log(target.files[0].path);

          try {
            const raw = await target.files[0].text();
            const config: TestConfig = JSON.parse(raw);
            console.log(config);
            setTestConfig(config);
            setShowSplash(true);
          } catch (error) {
            alert("Couldn't load test config!");
            return;
          }
        }
      });
      element.click();
    } catch (error) {
      alert("Couldn't load test!");
      return;
    }
  }

  const handleViewTest = () => {
    try {
      const element = document.createElement("input");
      element.type = "file";
      element.addEventListener('change', async (e) => {
        const target = e.target as HTMLInputElement;
        if(target.files) {
          setGradedFile(target.files[0]);
          console.log(target.files[0].path);

          const raw = await target.files[0].text();
          try {
            const graded: GradedTest = JSON.parse(raw);
            console.log(graded);
            setGradedTest(graded);
          } catch (error) {
            alert("Couldn't parse test! Make sure it's .json");
            return;
          }
        }
      });
      element.click();
    } catch (error) {
      alert("Couldn't load graded test! Make sure you select .json and not .csv");
      return;
    }
  }

  const openTestView = (gt: GradedTest, config: TestConfig) => {
    setTestConfig(config);
    setGradedTest(gt);
  }

  return (
    <div className="app-container">
      { !testConfig && !gradedTest &&
      <div className="home">
        { showConfigMenu &&
          <ConfigMenu
            setTestConfig={setTestConfig}
            toggleConfigMenu={toggleConfigMenu}
          />
        }
        <div className="title-splash">
          <p className="app-title">MLS Prepmate</p>
        </div>
        <div className="options">
          <div className="option-card" onClick={handleStartTest}>
            <FontAwesomeIcon icon={faPencil} className="option-icon"/>
            <p>Start Test</p>
          </div>
          <div className="option-card" onClick={toggleConfigMenu}>
            <FontAwesomeIcon icon={faGear} className="option-icon"/>
            <p>Configure New Test</p>
          </div>
          <div className="option-card" onClick={handleViewTest}>
            <FontAwesomeIcon icon={faListCheck} className="option-icon"/>
            <p>View Graded Test</p>
          </div>
        </div>
      </div>
      }
      { showSplash && testConfig &&
      <Splash config={testConfig} backToHome={backToHome} toggleSplash={toggleSplash}/>
      }
      { testConfig && !gradedTest && !showSplash &&
      <TestView config={testConfig} openTestView={openTestView} />
      }
      { gradedTest &&
      <ReportView gt={gradedTest} backToHome={backToHome} />
      }
    </div>
  );
}

export default Home;
