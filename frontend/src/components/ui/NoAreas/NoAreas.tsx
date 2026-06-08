import styles from './NoAreas.module.css';

import { useTranslation } from 'react-i18next';

interface NoAreasProps {
  onClick: () => void;
}

const NoAreas = ({ onClick }: NoAreasProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1>{t('no-areas.no-assigned-area')}</h1>
      <p>
        {t('no-areas.assign-area-first')}
      </p>
      <button className={styles.submitBtn} onClick={onClick}>
        {t('no-areas.assign-area')}
      </button>
    </div>
  );
}

export default NoAreas;