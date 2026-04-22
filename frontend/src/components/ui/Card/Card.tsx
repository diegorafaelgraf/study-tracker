import { useState } from 'react';
import styles from './Card.module.css';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
};

export default function Card({ children, onClick, disabled, tooltip }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={styles.cardContainer}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={styles.card}
        onClick={!disabled ? onClick : undefined}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        {children}
      </div>
      {showTooltip && tooltip && (
        <div className={styles.tooltip}>
          {tooltip}
        </div>
      )}
    </div>
  );
}