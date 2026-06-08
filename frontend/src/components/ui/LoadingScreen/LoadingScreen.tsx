import styles from "./LoadingScreen.module.css";

import { useTranslation } from 'react-i18next';

export default function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p>{t('cargando')}</p>
    </div>
  );
}