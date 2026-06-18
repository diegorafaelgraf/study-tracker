import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es/translation.json';
import en from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es,
      },
      en: {
        translation: en,
      },
    },
    supportedLngs: ['es', 'en'],
    load: 'languageOnly',
    lng: typeof navigator !== 'undefined'
      ? navigator.language.split('-')[0]
      : 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;