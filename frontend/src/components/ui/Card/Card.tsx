import { useState } from 'react';
import styles from './Card.module.css';

type Props = {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  message?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
  button?: React.ReactNode;
  onClick?: () => void;
  highlight?: boolean;
  icon?: React.ReactNode;
};

export default function Card({ children, title, subtitle, message, disabled, tooltip, button, onClick, highlight, icon }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={styles.cardContainer}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      <div
        className={`${styles.card}${highlight ? ` ${styles.highlight}` : ''}`}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderTitle}>
            {icon && <div className={styles.cardIcon}>{icon}</div>}
            <div>
              <h2>{title}</h2>
              <div className={styles.subtitle}>{subtitle}</div>
            </div>
          </div>
          {button}
        </div>

        <div className={styles.message}>{message}</div>
        <div className={styles.cardContent}>{children}</div>
      </div>
      {showTooltip && tooltip && (
        <div className={styles.tooltip}>
          {tooltip}
        </div>
      )}
    </div>
  );
}