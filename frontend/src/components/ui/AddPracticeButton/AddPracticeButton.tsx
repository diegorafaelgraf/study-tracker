import { useState } from 'react';

import styles from './AddPractice.module.css';

type AddPracticeButtonProps = {
  className?: string;
  onClick?: () => void;
  tooltip?: string;
};

export default function AddPracticeButton({ className, onClick, tooltip }: AddPracticeButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.AddPracticeButton} ${className || ''}`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        +
      </button>
      {showTooltip && tooltip && (
        <div className={styles.tooltip}>
          {tooltip}
        </div>
      )}
    </div>
  );
}