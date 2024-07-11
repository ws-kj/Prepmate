import React, { useState } from 'react';
import { Annotation } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface AnnotationEditorProps {
  questionId: number,
  passageText: string,
  start: number,
  end: number,
  text: string,
  toggleAnnotationEditor: () => void,
  setAnnotation: (annotation: Annotation) => void,
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  questionId,
  passageText,
  start,
  end,
  text,
  toggleAnnotationEditor,
  setAnnotation,
}) => {
  const [enteredText, setEnteredText] = useState<string>(text);

  const saveAnnotation = () => {
    setAnnotation({
      questionId: questionId,
      start: start,
      end: end,
      text: enteredText,
    });
    toggleAnnotationEditor();
  }

  return (
    <div className="annotation-editor">
      <div className="annotation-header">
        <p className="annotation-title">
          <span className="new-annotation">New Annotation: </span>
          "{passageText}"
        </p>
        <FontAwesomeIcon
          className="close-popup close-annotation-editor"
          icon={ faClose }
          onClick={toggleAnnotationEditor}
        />
      </div>
      <div className="annotation-editor-body">
        <textarea
          value={enteredText}
          onChange={e => setEnteredText(e.target.value)}/>
        <div className="annotation-footer">
          <button className="save-annotation" onClick={saveAnnotation}>Save</button>
          <button className="cancel-annotation" onClick={toggleAnnotationEditor}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AnnotationEditor;
