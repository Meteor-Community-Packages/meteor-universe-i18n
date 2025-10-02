import { Meteor } from 'meteor/meteor';

import { i18n } from './common';
import './global';

i18n.setOptions({ hostUrl: Meteor.absoluteUrl() });

i18n._loadLocaleWithAncestors = (locale, options) => {
  if (i18n.options.sameLocaleOnServerConnection) {
    Meteor.call('universe.i18n.setServerLocaleForConnection', locale);
  }

  let promise = Promise.resolve();
  if (!options?.noDownload) {
    const locales = i18n._normalizeWithAncestors(locale);
    for (const locale1 of locales) {
      i18n._isLoaded[locale1] = false;
    }

    const loadOptions = { ...options, silent: true };
    promise = locales.reduce(
      (thunk, locale) =>
        thunk.then(() =>
          i18n.loadLocale(locale, loadOptions).then(() => {
            i18n._isLoaded[locale] = true;
          }),
        ),
      promise,
    );
  }

  return promise;
};

i18n.loadLocale = (locale, options) => {
  const normalizedLocale = i18n.normalize(locale);
  if (!normalizedLocale) {
    i18n._logger(new Error(`Unrecognized locale "${locale}"`));
    return Promise.resolve(undefined);
  }

  const url = [
    options?.host ?? i18n.options.hostUrl,
    options?.pathOnHost ?? i18n.options.pathOnHost,
    normalizedLocale,
    '?ts=',
    options?.fresh ? Date.now() : i18n._ts,
  ].join('');

  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      return resolve(existing as HTMLScriptElement);
    }

    const script = document.createElement('script');
    script.async = !!options?.async;
    script.src = url;
    script.type = 'text/javascript';

    script.addEventListener('load', () => resolve(script), false);
    script.addEventListener('error', () => reject(script), false);

    document.head.appendChild(script);
  });

  if (!options?.silent) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    promise.then(() => {
      // If the current locale has changed we must notify about that.
      if (
        i18n.getLocale().startsWith(normalizedLocale) ||
        i18n.options.defaultLocale.startsWith(normalizedLocale)
      ) {
        i18n._emitChange();
      }
    });
  }

  return promise;
};

const preloaded = (window as any).__uniI18nPre;
if (typeof preloaded === 'object') {
  for (const [locale, translations] of Object.entries(preloaded as Record<string, unknown>)) {
    if (translations) {
      i18n.addTranslations(locale, translations);
    }
  }
}

(Meteor as any).connection._stream.on('reset', () => {
  if (i18n.options.sameLocaleOnServerConnection && i18n._locale) {
    Meteor.call('universe.i18n.setServerLocaleForConnection', i18n._locale);
  }
});

export { i18n };
export default i18n;
