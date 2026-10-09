import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play, Square } from 'lucide-react';

import styles from './MinutCounter.module.css';

interface MinutCounterProps {
  title?: string;
  onSuccess?: () => void;
}

export default function MinutCounter({ title, onSuccess }: MinutCounterProps) {
  const { t } = useTranslation();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

  return (
    <section className={styles.container} aria-label={title || t('common.minut-counter')}>
      {title && <h1 className={styles.title}>{title}</h1>}

      <output className={styles.display} aria-live="off" aria-label={`${minutes}:${seconds}`}>
        {minutes}:{seconds}
      </output>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.startBtn}
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          <Play size={18} aria-hidden="true" />
          {t('minute-counter.start')}
        </button>
        <button
          type="button"
          className={styles.pauseBtn}
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          <Pause size={18} aria-hidden="true" />
          {t('minute-counter.pause')}
        </button>
        <button
          type="button"
          className={styles.stopBtn}
          onClick={() => {
            setIsRunning(false);
            setElapsedSeconds(0);
          }}
          disabled={!isRunning && elapsedSeconds === 0}
        >
          <Square size={16} aria-hidden="true" />
          {t('minute-counter.stop')}
        </button>
      </div>

      {onSuccess && (
        <button type="button" className={styles.closeBtn} onClick={onSuccess}>
          {t('practice.cancel')}
        </button>
      )}
    </section>
  );
}