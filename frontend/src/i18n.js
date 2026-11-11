import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  hi: {
    translation: translationHI
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi'],
    load: 'languageOnly',
    lng: localStorage.getItem('language') || 'en',
    interpolation: {
      escapeValue: false
    }
  });

const updatePageLanguage = (lang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = String(lang || 'en').startsWith('hi') ? 'hi' : 'en';
  }
};
i18n.on('languageChanged', updatePageLanguage);
updatePageLanguage(i18n.language);

export default i18n;
