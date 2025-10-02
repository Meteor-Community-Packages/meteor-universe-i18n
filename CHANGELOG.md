## [v3.0.1](https://github.com/vazco/meteor-universe-i18n/tree/v3.0.1) (2024-09-13)

- **Fixed:** Preserving context of environment variables in an altered publication ([\#188](https://github.com/vazco/meteor-universe-i18n/pull/191))

## [v3.0.0](https://github.com/vazco/meteor-universe-i18n/tree/v3.0.0) (2024-07-26)

- **Breaking:** Added support for Meteor 3.0 ([\#188](https://github.com/vazco/meteor-universe-i18n/pull/188))

- **Breaking:** Removed support for Meteor <3.0

## [v2.1.0](https://github.com/vazco/meteor-universe-i18n/tree/v2.1.0) (2023-09-27)

- **Added:** Pluralization ([\#183](https://github.com/vazco/meteor-universe-i18n/pull/183))

## [v2.0.8](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.8) (2023-05-24)

- **Fixed:** Cache management ([\#182](https://github.com/vazco/meteor-universe-i18n/pull/182))

## [v2.0.7](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.7) (2022-03-17)

- **Removed:** Usage of Fibers ([\#181](https://github.com/vazco/meteor-universe-i18n/pull/181))

## [v2.0.6](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.6) (2022-03-17)

- **Removed:** Support for Meteor <2.3 ([\#180](https://github.com/vazco/meteor-universe-i18n/pull/180))

## [v2.0.5](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.5) (2022-01-12)

- **Fixed:** JSON FetchError related to missing query parameter.

## [v2.0.2](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.2) (2022-01-04)

- **Fixed:** The published version was corrupted and couldn't be downloaded.

## [v2.0.1](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.1) (2022-12-30)

- **Fixed:** Importing translation files ([\#176](https://github.com/vazco/meteor-universe-i18n/pull/176))
- **Added:** Support for Meteor 1.9 ([\#177](https://github.com/vazco/meteor-universe-i18n/pull/177))

## [v2.0.0](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.0) (2022-10-27)

- **Updated:** Integration examples ([\#169](https://github.com/vazco/meteor-universe-i18n/pull/169))
- **Added:** Detailed React, Blaze and Svelte integration examples ([\#164](https://github.com/vazco/meteor-universe-i18n/pull/164))

## [v2.0.0-rc.2](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.0-rc.2) (2022-08-19)

- **Added:** Generated `.d.ts` files ([\#157](https://github.com/vazco/meteor-universe-i18n/pull/157))

## [v2.0.0-rc.1](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.0-rc.1) (2022-07-19)

- **Added:** Support for the `zodern:types` package. ([\#159](https://github.com/vazco/meteor-universe-i18n/pull/159))
- **Added:** Migration to v2 guide

## [v2.0.0-rc.0](https://github.com/vazco/meteor-universe-i18n/tree/v2.0.0-rc.0) (2022-04-28)

Implemented [Roadmap v2](https://github.com/vazco/meteor-universe-i18n/issues/144). ([\#152](https://github.com/vazco/meteor-universe-i18n/pull/152))

- **Breaking:** Removed locales and currency data.
- **Breaking:** Removed `parseNumber`, `getLanguages`, `getCurrencyCodes`, `getCurrencySymbol`, `getLanguageName`, `getLanguageNativeName` and `isRTL` functions.
- **Breaking:** Removed `_purify` option.
- **Breaking:** Removed `createTranslator` and `createReactiveTranslator` functions.
- **Breaking:** Removed React integration - `createComponent` and `getRefreshMixin` functions.
- **Changed:** Extracted string interpolation into a separate, replacable function.
- **Added:** CI workflow for tests
- **Changed:** Removed old documentation and added React and Blaze integration examples
