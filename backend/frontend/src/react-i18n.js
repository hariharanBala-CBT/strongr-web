import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Backend to load translations from remote server (JSON files)
  .use(Backend)
  // Language detector to detect user's language preference
  .use(LanguageDetector)
  // Initialize react-i18next
  .use(initReactI18next)
  .init({
    // Detection order for language preference
    detection: {
      order: ['querystring', 'navigator', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
    },
    // Fallback language if translation is missing
    fallbackLng: 'en',
    // Enable debugging mode
    debug: false,
    // Interpolation options (not needed for React as it escapes by default)
    interpolation: {
      escapeValue: false,
    },
    // Load only language (ignore country codes)
    load: 'languageOnly',
    // Default namespace to load (if not specified, it will attempt to load `/en/translation.json`)
    ns: [],
    // Define where your translations files are located
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
