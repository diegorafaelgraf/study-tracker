import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // 0 to 100
  text_before: string;
  text_after?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, text_before, text_after }) => {
  return (
    <>
      <div className="progress-label">
        {text_before + ' '}
        <b>{progress.toFixed(2)} %</b>
        {text_after && <span>{' ' + text_after}</span>}
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;