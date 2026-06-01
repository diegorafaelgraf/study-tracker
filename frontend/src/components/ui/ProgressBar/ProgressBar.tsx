import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <>
      <div className="progress-label">
        Progresaste un {' '}
        <b>{progress.toFixed(2)} %</b>
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