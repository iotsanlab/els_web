import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını içe aktarıyoruz
import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';

// Kullanılabilir diller
export const languages = {
  en: { nativeName: 'English', flag: '🇬🇧' },
  tr: { nativeName: 'Türkçe', flag: '🇹🇷' }
};

// Çevirileri kaynaklar olarak ekliyoruz
const resources = {
  en: {
    translation: translationEN
  },
  tr: {
    translation: translationTR
  }
};

i18n
  // Tarayıcı dilini otomatik algılamak için
  .use(LanguageDetector)
  // React ile entegrasyon için
  .use(initReactI18next)
  // i18next'i başlatıyoruz
  .init({
    resources,
    fallbackLng: 'tr', // Varsayılan dil
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React zaten XSS koruması sağlıyor
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 