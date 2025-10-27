import { en } from './en';
import { nl } from './nl';
import { ar } from './ar';
import { zh } from './zh';

export const translations = {
  en,
  nl,
  ar,
  zh,
};

export const locales = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文 (简体)' },
];

export type LocaleCode = keyof typeof translations;
