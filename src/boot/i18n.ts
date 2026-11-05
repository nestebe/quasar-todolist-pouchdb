import { defineBoot } from '#q-app';
import { Lang } from 'quasar';
import { createI18n } from 'vue-i18n';

import { datetimeFormats, detectLocale, locales, messages, type AppLocale } from '@/i18n';

// English is the master schema for the resources
export type MessageSchema = (typeof messages)['en-US'];

// https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {
    long: Intl.DateTimeFormatOptions;
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export const i18n = createI18n<{ message: MessageSchema }, AppLocale, false>({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages,
  datetimeFormats,
});

/** Applies a locale everywhere: vue-i18n, Quasar components and <html lang>. */
export function applyLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale;
  // Quasar's lang pack type and Lang.set() parameter disagree on `formatNumber`
  // under exactOptionalPropertyTypes: the packs are valid, only the typings differ.
  Lang.set(locales[locale].quasarLang as Parameters<typeof Lang.set>[0]);
  document.documentElement.lang = locale;
}

export default defineBoot(({ app }) => {
  app.use(i18n);
  applyLocale(detectLocale());
});
