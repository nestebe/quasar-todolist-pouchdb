import type { QuasarLanguage } from 'quasar';
import quasarLangEnUS from 'quasar/lang/en-US';
import quasarLangFr from 'quasar/lang/fr';

import enUS from './en-US';
import frFR from './fr-FR';

export const messages = {
  'en-US': enUS,
  'fr-FR': frFR,
};

export type AppLocale = keyof typeof messages;

/** Locales offered in the language switcher, with the matching Quasar language pack. */
export const locales: Record<AppLocale, { label: string; quasarLang: QuasarLanguage }> = {
  'en-US': { label: 'English', quasarLang: quasarLangEnUS },
  'fr-FR': { label: 'Français', quasarLang: quasarLangFr },
};

const datetime = { long: { dateStyle: 'medium', timeStyle: 'short' } } as const;

export const datetimeFormats = {
  'en-US': datetime,
  'fr-FR': datetime,
};

const STORAGE_KEY = 'locale';

function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && value in messages;
}

/** Saved choice first, then the browser languages, English as fallback. */
export function detectLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isAppLocale(saved)) {
      return saved;
    }
  } catch {
    // storage unavailable (private mode…)
  }
  const preferred = navigator.languages.find((lang) => /^(en|fr)\b/i.test(lang));
  return preferred?.toLowerCase().startsWith('fr') ? 'fr-FR' : 'en-US';
}

export function saveLocale(locale: AppLocale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // storage unavailable (private mode…)
  }
}
