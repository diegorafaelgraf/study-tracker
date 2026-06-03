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
  hideTooltip?: boolean;
};

export default function Card({
  children,
  title,
  subtitle,
  message,
  disabled,
  tooltip,
  button,
  onClick,
  highlight,
  icon,
  hideTooltip
}: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={styles.cardContainer}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => tooltip && setShowTooltip(false)}
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
          <div onMouseOver={(e) => {
            e.stopPropagation();
            if (tooltip) setShowTooltip(false);
          }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              if (!hideTooltip && tooltip) {
                setShowTooltip(true);
              }
            }}>
            {button}
          </div>
        </div>

        <div className={styles.message}>{message}</div>
        <div className={styles.cardContent}>{children}</div>
      </div>
      {!hideTooltip && showTooltip && tooltip && (
        <div className={styles.tooltip}>
          {tooltip}
        </div>
      )}
    </div>
  );
}