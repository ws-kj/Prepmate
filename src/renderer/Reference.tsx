import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import image from 'assets/ReferenceEdited.png';

interface ReferenceProps {
  showReference: boolean;
  toggleReference: () => void;
}

const Reference = React.FC<ReferenceProps> = ({showReference, toggleReference}) => {

  return (
    <div className="reference">
      <div className="review-header">
        <FontAwesomeIcon
          className="close-popup"
          icon={faClose}
          onClick={toggleReference}
        />
        <p className="section-title">Math References</p>
      </div>
      <div className="ref-image-container">
        <img src={image} className="ref-image"/>
      </div>
    </div>
  );
};

export default Reference;
