export type Locale = 'en' | 'pt-BR' | 'vi';

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: Array<{ value: Locale; label: string; shortLabel: string }> = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'pt-BR', label: 'Português', shortLabel: 'PT' },
  { value: 'vi', label: 'Tiếng Việt', shortLabel: 'VI' },
];

export { useTranslation } from './useTranslation';
