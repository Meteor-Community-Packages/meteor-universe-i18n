import { EventEmitter } from 'events';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import type { JSONObject } from './utils';
export interface GetCacheEntry {
    getJS(locale: string, namespace?: string, isBefore?: boolean): string;
    getJSON(locale: string, namespace?: string, diff?: string): string;
    getYML(locale: string, namespace?: string, diff?: string): string;
    updatedAt: string;
}
export interface GetCacheFunction {
    (): Record<string, GetCacheEntry>;
    (locale: string): GetCacheEntry;
}
export interface GetTranslationOptions {
    _locale?: string;
    _namespace?: string;
    _count?: number;
    [key: string]: unknown;
}
export interface LoadLocaleOptions {
    async?: boolean;
    fresh?: boolean;
    host?: string;
    pathOnHost?: string;
    queryParams?: Record<string, unknown>;
    silent?: boolean;
}
export interface Options {
    close: string;
    defaultLocale: string;
    hideMissing: boolean;
    hostUrl: string;
    ignoreNoopLocaleChanges: boolean;
    localeRegEx: RegExp;
    open: string;
    pathOnHost: string;
    sameLocaleOnServerConnection: boolean;
    translationsHeaders: Record<string, string>;
    pluralizationRules: Record<string, (count: number) => number>;
    pluralizationDivider: string;
}
export interface SetLocaleOptions extends LoadLocaleOptions {
    noDownload?: boolean;
}
declare const i18n: {
    _contextualLocale: Meteor.EnvironmentVariable<string | undefined>;
    _deps: Tracker.Dependency;
    _emitChange(locale?: string): void;
    _events: EventEmitter<[never]>;
    _formatgetters: Pick<GetCacheEntry, "getJS" | "getJSON" | "getYML">;
    _getConnectionId(connection?: Meteor.Connection | null): string | undefined;
    _getConnectionLocale(connection?: Meteor.Connection | null): string | undefined;
    _isLoaded: Record<string, boolean>;
    _loadLocaleWithAncestors(locale: string, options?: SetLocaleOptions): Promise<void>;
    _locale: string;
    _logger(error: unknown): void;
    _normalizeWithAncestors(locale?: string): readonly string[];
    _normalizeWithAncestorsCache: Record<string, readonly string[]>;
    _translations: JSONObject;
    _ts: number;
    _interpolateTranslation(variables: Record<string, unknown>, translation: string): string;
    _normalizeGetTranslation(locales: string[], key: string): string;
    _pluralizeTranslation(translation: string, locale: string, count?: number): string;
    __(...args: unknown[]): string;
    addTranslation(locale: string, ...args: unknown[]): {};
    addTranslations(locale: string, ...args: unknown[]): JSONObject;
    getAllKeysForLocale(locale?: string, exactlyThis?: boolean): string[];
    getCache: GetCacheFunction;
    getLocales(): string[];
    getLocale(): string;
    getTranslation(...args: unknown[]): string;
    getTranslations(key?: string, locale?: string): {};
    isLoaded(locale?: string): boolean;
    loadLocale(locale: string, options?: LoadLocaleOptions): Promise<HTMLScriptElement | undefined>;
    normalize(locale: string): string | undefined;
    offChangeLocale(fn: (locale: string) => void): void;
    onChangeLocale(fn: (locale: string) => void): void;
    onceChangeLocale(fn: (locale: string) => void): void;
    options: Options;
    runWithLocale<T>(locale: string | undefined, fn: () => T): T;
    setLocale(locale: string, options?: SetLocaleOptions): Promise<void>;
    setLocaleOnConnection(locale: string, connectionId?: string): void;
    setOptions(options: Partial<Options>): void;
};
export { i18n };
export default i18n;
//# sourceMappingURL=common.d.ts.map