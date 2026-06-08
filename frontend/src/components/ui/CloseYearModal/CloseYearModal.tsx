import ReactModal from 'react-modal';

import { useTranslation } from 'react-i18next';

import styles from './CloseYearModal.module.css';

ReactModal.setAppElement('#root');

type Props = {
  isOpen: boolean;
  onCloseYear: () => void;
  onRemindLater: () => void;
}

export function CloseYearModal({ isOpen, onCloseYear, onRemindLater }: Props) {
  if (!isOpen) return null;
  const { t } = useTranslation();
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRemindLater}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>{t('close-year.past-year')}</h2>

      <p>
        {t('close-year.past-year-detected-message')}
        <br />
        <br />
        <b>{t('close-year.past-year-close-warning')}</b>
      </p>

      <div className={styles.actions}>
        <button onClick={onRemindLater} className={styles.submitBtn}>
          {t('close-year.remember-later')}
        </button>

        <button onClick={onCloseYear} className={styles.cancelBtn}>
          {t('close-year.close-year')}
        </button>
      </div>
    </ReactModal>
  );
}