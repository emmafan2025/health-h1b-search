import { en } from './en';
import { zh } from './zh';

export type Language = 'en' | 'zh';
export type TranslationKeys = typeof en;

export const translations = {
  en,
  zh
};

export { en, zh };