import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, LocaleCode } from '../locales';

type TranslateFunction = (key: string, replacements?: { [key: string]: string | number }) => string;

interface LocaleContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: TranslateFunction;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const getInitialLocale = (): LocaleCode => {
    const savedLocale = localStorage.getItem('locale') as LocaleCode;
    if (savedLocale && translations[savedLocale]) {
        return savedLocale;
    }
    const browserLang = navigator.language.split('-')[0] as LocaleCode;
    return translations[browserLang] ? browserLang : 'en';
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(getInitialLocale());

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);
  
  const setLocale = (newLocale: LocaleCode) => {
    if (translations[newLocale]) {
        setLocaleState(newLocale);
    }
  };

  const t: TranslateFunction = useCallback((key, replacements) => {
    const langTranslations = translations[locale] || translations.en;
    let translation = langTranslations[key as keyof typeof langTranslations] || translations.en[key as keyof typeof translations.en] || key;

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }

    return translation;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
