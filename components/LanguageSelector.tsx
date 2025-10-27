import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { locales } from '../locales';

const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="appearance-none bg-brand-primary border border-brand-light/30 rounded-md py-2 ps-3 pe-8 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
        aria-label={t('language')}
      >
        {locales.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-brand-light">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
