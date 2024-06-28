import { Test, Question, Answer } from './types';
import { parse } from 'csv-parse/sync';
import { ElectronHandler } from '../main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

export const loadTest = (path: string): Test | null => {
  try {
    const file = window.electron.fileSystem.readFile(path);
    console.log(file);
  } catch (error) {
    console.log(error);
    return null;
  }
/*
  const records = parse(file, {
    columns: true,
    skipEmptyLines: true
  });

  console.log(records);
*/
  return null;
}
