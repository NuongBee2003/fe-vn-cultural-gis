import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from './locales/vi.json';
import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
  .use(LanguageDetector)      // tự detect ngôn ngữ từ localStorage / browser
  .use(initReactI18next)      // bind với React
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'vi',        // mặc định Tiếng Việt
    lng: localStorage.getItem('i18nextLng') || 'vi',

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,     // React đã escape XSS sẵn
    },
  });

export default i18n;
