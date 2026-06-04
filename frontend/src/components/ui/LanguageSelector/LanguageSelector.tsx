import { useTranslation } from 'react-i18next';
import styles from './LanguageSelectorToggle.module.css';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const isES = !(i18n.language && i18n.language.startsWith('en'));

  const handleToggle = () => {
    const to = isES ? 'en' : 'es';
    i18n.changeLanguage(to);
  };

  return (
    <div className={styles.toggleWrap}>
      <span className={isES ? `${styles.label} ${styles.labelActive}` : styles.label}>ES</span>

      <button
        type="button"
        role="switch"
        aria-checked={!isES}
        aria-label="Cambiar idioma"
        className={`${styles.toggle} ${!isES ? styles.toggleOn : ''}`}
        onClick={handleToggle}
      >
        <span className={styles.knob} />
      </button>

      <span className={!isES ? `${styles.label} ${styles.labelActive}` : styles.label}>EN</span>

      <span className={styles.visuallyHidden}>Idioma actual {isES ? 'español' : 'english'}</span>
    </div>
  );
}
