<a href="http://unicms.io"><img src="http://unicms.io/banners/standalone.png" /></a>
# Universe i18n
Internationalization package with support:
- namespacing of translation strings
- supported file formats **YAML** and **JSON**
- both types of parameters (named and positional)
- include support for typographic notation of numbers
- 353 locales (with basic informations: name, symbol of currency, rtl)
- regional dialects e.g. 'en-us' inherits from translations assigned to 'en'
- react component `<T>ok</T>`
- support for universe:modules (es6/modules)
- much better performance than other packages
  (Tracker dependency on every strings isn't light, so in React we use simple eventemitter)
- **incremental loading of translations**
  (Client do not need to download all translations at once)
- remote loading of translations from different host


**Table of Contents**

- [Universe i18n](https://github.com/vazco/meteor-universe-i18n/#universe-i18n)
  - [Instalation](https://github.com/vazco/meteor-universe-i18n/#instalation)
  - [Usage](https://github.com/vazco/meteor-universe-i18n/#usage)
    - [Setting/Getting locale](https://github.com/vazco/meteor-universe-i18n/#settinggetting-locale)
    - [Adding Translations my methods](https://github.com/vazco/meteor-universe-i18n/#adding-translations-my-methods)
    - [Getting translations](https://github.com/vazco/meteor-universe-i18n/#getting-translations)
    - [Creating react component](https://github.com/vazco/meteor-universe-i18n/#creating-react-component)
    - [Refresh mixin](https://github.com/vazco/meteor-universe-i18n/#refresh-mixin)
    - [Formatting numbers](https://github.com/vazco/meteor-universe-i18n/#formatting-numbers)
  - [Translations files](https://github.com/vazco/meteor-universe-i18n/#translations-files)
    - [Recognition locale of translation](https://github.com/vazco/meteor-universe-i18n/#recognition-locale-of-translation)
    - [Namespace](https://github.com/vazco/meteor-universe-i18n/#namespace)
      - [Translation in packages](https://github.com/vazco/meteor-universe-i18n/#translation-in-packages)
      - [Translation in application](https://github.com/vazco/meteor-universe-i18n/#translation-in-application)
  - [Incremental loading of translations](https://github.com/vazco/meteor-universe-i18n/#incremental-loading-of-translations)
  - [API](https://github.com/vazco/meteor-universe-i18n/#api)
  - [Support for blaze](https://github.com/vazco/meteor-universe-i18n/#support-for-blaze)
  - [Locales list](https://github.com/vazco/meteor-universe-i18n/#locales-list)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Instalation
```sh
$ meteor add universe:i18n
```

## Usage
This plugin is dedicated to work with react and modules, but you can use it without react.

```
import i18n from 'meteor/universe:i18n';
```

### Setting/Getting locale

```js
i18n.setLocale('en-US', params)
i18n.getLocale() //en-US
```

- params in setLocale are optional, but gives additional possibilities:
 - noDownload - disable downloading translation file on client (client side)
 - silent - protect against broadcasting the refresh event (both sides)
 - async - download translation in async way (client side)
 - fresh - download fresh translations (without browser cache)

Example for those, who want to set locale as in browser:

```js
// somewhere in page layout ( or in router?)
function getLang() {
    if (navigator.languages != undefined)  {
        return navigator.languages[0];
    }
    return navigator.language || navigator.browserLanguage;
}

i18n.setLocale(getLang());
```

But this will be work only on client side.
For server side you should read it from header 'accept-language'

### Adding Translations by methods

```js
import i18n from 'meteor/universe:i18n';

i18n.addTranslation('en-US', 'common', 'no', 'No');
i18n.addTranslation('en-US.common', 'ok', 'Ok');
i18n.addTranslation('en-US.common.ok', 'Ok');

i18n.addTranslations('en-US', {
    common: {
        hello: 'Hello {$name} {$0}!'
    }
});

i18n.addTranslations('en-US', 'common', {
    hello: 'Hello {$name} {$0}!'
});
```

### Getting translations
You can translate translation string on few way:
- you can create instance of react component ( can be predefined for context )
*about react component in next section*
- you can use 2 methods (i18n.getTranslation() or quicker call i18n.__())

```js
i18n.__(key);
i18n.__(key, params);
i18n.__(namespace, key, parameters);
i18n.__(namespace, key, parameters);
i18n.__(key, key, key, key, parameters);
//same with "getTranslation" e.g.:
i18n.getTranslation(key, key, key, key, parameters);
// namespaced translations
var t = i18n.createTranslator(namespace);
t(key, parameters);
// different language translations
var t2 = i18n.createTranslator('', 'fr-fr');
t2(key, parameters);
```

If needed, parameters can be passed as last of function argument, as a object or array.
Parameters can be named or positional (indexed).
For positional parameters isn't important if passed was array or object with keys 0,1,2...
Or if they are mixed with named parameters.

```yml
 _namespace: ''
 hello: Hello {$name}!
 lengthOfArr: length {$length}
 items: First item {$0} and last is {$2}!
```

```js
i18n.__('hello', {name: 'Ania'}); //output: Hello Ania!
i18n.__('lengthOfArr', {length:['a', 'b', 'c'].length}); //output: length 3
i18n.__('items', ['a', 'b', 'c']); //output: First item a and last is c!
```

### Creating react component

```js
import i18n from 'meteor/universe:i18n';

//instance of translate component with top-level context
const T = i18n.createComponent();

// Later...
<T>common.no</T>
<T>common.ok</T>
<T name="World" {...[69]}>common.hello</T>
```

```jsx
import i18n from 'meteor/universe:i18n';
//instance of translate component in "common" namespace
const T = i18n.createComponent(i18n.createTranslator('common'));

// Later...
<T>ok</T>
// this time with override locale
<T _locale='pl-PL'>hello</T>
// overriding the default DOM element 'span' with 'h1'
<T tagType='h1'>hello</T>
// providing props to the element
<T props={{ className: 'text-center', style: { color: '#f33' }}}>hello</T>
```

### Refresh mixin
A simple mixin for react that refreshes whole component when locale was changed.
(as a benefit it provides "locale" property in state)

```
import {refreshOnChangeLocaleMixin} from 'meteor/universe:i18n';

export default React.createClass({
    displayName: 'StatsWidget',
    mixins: [refreshOnChangeLocaleMixin],
    /* ... */
});
```

### Formatting numbers

```js
i18n.parseNumber('7013217.715'); // 7,013,217.715
i18n.parseNumber('16217 and 17217,715'); // 16,217 and 17,217.715
i18n.parseNumber('7013217.715', 'ru-RU'); // 7 013 217,715
```

## Translations files

Instead of setting translations directly by i18n.addTranslation(s).
You can store translations in files YAML or JSON, according with following file extensions: **.i18n.yml**, **.i18n.json**.
Because of lazy loading of locales, the translation files should be placed in common space. *But only for incremental loading of locale (default behavior), if locales are attached to the bundle, this isn't important*

### Recognition locale of translation
Name of file can be any but only if in file has the locale declared under key **'_locale'**

```yml
_locale: 'en-US',
title: Title
```

Other ways file should have name of his locale or be in directory under this name:

```bash
en.i18n.yml
en.i18n.json
en_us.i18n.yml
en-us.i18n.yml
en/us.i18n.yml
en-US/someName.i18n.yml
someDir/en-us/someName.i18n.yml
```
### Namespace

Translations in translation file can be namespaced depend where are.
Namespace can be set up only for whole file, but file can add deeper embedded structure.

#### Translation in packages

For example, translations files in packages are namespaced as a default by package name.

```json
//file en.json in package universe:profile
{
    "userName": "User name"
}
```

```js
import i18n from 'meteor/universe:i18n';

i18n.__('universe:profile', 'userName') //output: User name

// in react:
const T = i18n.createComponent();
<T>universe:profile.userName</T>
// or
const T2 = i18n.createComponent(i18n.createTranslator('universe:profile'));
<T2>userName</T2>
```

You can change default namespace for file by setting prefix to file under key "_namespace"

```json
//file en.json in package universe:profile
{
    "_namespace": "common",
    "userName": "User name"
}
```

And now:

```js
i18n.__('common', 'userName') //output: User name
i18n.__('common.userName') //output: User name

// in react:
const T = i18n.createComponent();
<T>common.userName</T>
```

*TIP:* You can also add translations from package on the top-level by passing empty string '' in key "_namespace"

#### Translation in application

Here your translations by default aren't namespaced.
It mean that your translation from application space are on top-level
and they can override every namespace.

for example:

```yml
# file en_us.yml in application space (not from package)
userName: User name
```

```js
i18n.__('userName') //output: User name
// in react:
const T = i18n.createComponent();
<T>userName</T>
```

If you want add translation under namespace, you should define it in key '_namespace'

```yml
_namespace: user.listing.item
userName: User name
```

```js
i18n.__('user.listing.item.userName'); //output: User name
i18n.__('user', 'listing', 'item.userName'); //output: User name
// in react:
const T = i18n.createComponent();
<T>user.listing.item.userName</T>
// or
const T2 = i18n.createComponent('user.listing');
<T2>item.userName</T2>
```

## Listener on change language

```
// Adding listener on change language
i18n.onChangeLocale (function(newLocale){
    console.log(newLocale);
})

// Removing listener
i18n.offChangeLocale (fn)

// Make something on first change and stop listener
i18n.onceChangeLocale (fn)
```

## Incremental loading of translations

Since version 1.3.0, this package adds to the project bundle for browser side
only default language (en-us), not all (of course this is default behavior and is configurable).

This mean that client browser does not download unnecessary languages.
If user changes current locale, translations for new locale will be downloaded on demand.

If you want to add all or selected translations to the production bundle you can set
under `UNIVERSE_I18N_LOCALES` environment variable:

- `UNIVERSE_I18N_LOCALES = all` for bundling all translations strings
- one or more locales as codes to attach them in bundle, (as a separator you should use `,`)

 e.g. `UNIVERSE_I18N_LOCALES = 'de-CH, pl'`

- [How set an environment variable](http://www.schrodinger.com/kb/1842)
- Note: If you want use this flag, is very important to do this before meteor prepares bundle (after that, setting this variable will be useless)

**Again how it works:**
If user will change current locale on that what isn't attached to client bundle, translations for new locale will be downloaded on demand. So, any time when `i18n.setLocale('de-CH')` is called and language isn't attached to client bundle. I18n will be try to download that language from server (you can customize url of host to getting translations, but default is same as Meteor.absoluteUrl() returns)

Additionally `i18n.setLocale()` returns promise.
e.g:
```
i18n.setLocale('en-AU').then(function () {
    console.log('already is!');
});
```

also you can listen on this event:
```
i18n.onChangeLocale (function(newLocale){
    console.log(newLocale);
})
```

### Listing available languages

You can use `i18n.getLanguages` to list all languages with at least one translation:
```javascript
i18n.getLanguages() // ['en', 'de']
i18n.getLanguages('name') // ['English', 'German']
```

This method will show all available translations on the server but only loaded translations on the client.

To build a language picker with all possible options you would need to fetch data from the server, e.g. by a method:
```javascript
Meteor.methods({
    getLanguages() {
        return i18n.getLanguages().map(code => ({
            code,
            name: i18n.getLanguageNativeName(code)
        }));
    }
});
```


## API
```js
// create React component
i18n.createComponent(translator, locale, reactjs, type);
//  @params:
//    translator - (optional, default is i18n.createTranslator())
//      using this argument you can set different function for translation or the namespace for default translator.
//    locale - (optional, default current locale) set language for this component (can be different than on rest of site)
//    reactjs - (optional, as a default it tries to get React from global variable)
//      you can pass React object if is not available in global scope
//    type - (optional, as default it uses <span> to render the content.) set which DOM element that will be rendered, e.g. 'li', 'div' or 'h1'.

// create namespaced translator
i18n.createTranslator(namespace, locale);

// create reactive translator for autoruns
i18n.createReactiveTranslator(namespace, locale);
// TIP: Remember tracker dependency object isn't light, so in react this isn't necessary
//our React component can be reactive and much lighter for performance

// add translation
i18n.addTranslation(locale, namespace, key, ..., translation);

// add translations (same as addTranslation)
i18n.addTranslations(locale, namespace, translationsMap);

// get translation
i18n.getTranslation(namespace, key, ..., params);
i18n.__(namespace, key,..., params);

// get translations ( default locale is current )
i18n.getTranslations(namespace, locale);

// options
i18n.setOptions({
    // opening string
    open: '{$',

    // closing string
    close: '}',

    // decide whether to show when there's no translation in the current and default language
    hideMissing: false

    // url to the host with translations (default: Meteor.absoluteUrl())
    // useful when you want to load translations from different host
    hostUrl: 'http://current.host.url/',

    // (On server side only) Gives you possibility of adding/changing response headers
    translationsHeaders = {'Cache-Control':'max-age=2628000'}
});

// formatting numbers for locale ( default locale is current )
i18n.parseNumber(number, locale);

// change locale
i18n.setLocale(locale, params);
// this function on client side returns promise (but only if parameter `noDownload !== true`)

// Getting locale
i18n.getLocale();

// Getting languages with at least one translation
i18n.getLanguages(type = 'code')
i18n.getLanguages() // ['de', 'en']
i18n.getLanguages('name') // ['German', 'English']
i18n.getLanguages('nativeName') // ['Deutsch', 'English']

// fetch translations file from remote server (client/server)
i18n.loadLocale(locale, params)
//@params on client { fresh = false, async = false, silent = false,
// host = i18n.options.hostUrl, pathOnHost = i18n.options.pathOnHost }
//@params on server { queryParams = {}, fresh = false, silent = false,
// host = i18n.options.hostUrl, pathOnHost = i18n.options.pathOnHost }
// On server side, this method uses HTTP.get with query parameter `type=json` to fetch json data.
// On client site, it adds new script with translations to head node.
// this function returns promise

// Executes function in locale context,
i18n.runWithLocale(locale, func)
// it mean, every default locale used inside called function will be set into passed locale.
// please remember that locale must be loaded first (if is not bundled)

// Additional informations about locale ( default locale is current )

getCurrencySymbol (code) // or locale with country
returns currency symbol if is known

i18n.getCurrencySymbol('en-US') // = $
i18n.getCurrencySymbol('USD') // = $
i18n.getCurrencyCodes('en-US') // = ["USD", "USN", "USS"]

getLanguageName (locale)
getLanguageNativeName (locale)
isRTL (locale)
getAllKeysForLocale(locale, exactlyThis = false)
```

## Support for blaze

[universe:i18n-blaze](https://atmospherejs.com/universe/i18n-blaze)


## Locales list (353 locales suported)
*( predefined for parseNumber, currency, names, native names)*
```
af, af-ZA, am, am-ET, ar, ar-AE, ar-BH, ar-DZ, ar-EG, ar-IQ, ar-JO, ar-KW, ar-LB, ar-LY, ar-MA, ar-OM, ar-QA, ar-SA, ar-SY, ar-TN, ar-YE, arn, arn-CL, as, as-IN, az, az-Cyrl, az-Cyrl-AZ, az-Latn, az-Latn-AZ, ba, ba-RU, be, be-BY, bg, bg-BG, bn, bn-BD, bn-IN, bo, bo-CN, br, br-FR, bs, bs-Cyrl, bs-Cyrl-BA, bs-Latn, bs-Latn-BA, ca, ca-ES, co, co-FR, cs, cs-CZ, cy, cy-GB, da, da-DK, de, de-AT, de-CH, de-DE, de-LI, de-LU, dsb, dsb-DE, dv, dv-MV, el, el-GR, en, en-029, en-AU, en-BZ, en-CA, en-GB, en-IE, en-IN, en-JM, en-MY, en-NZ, en-PH, en-SG, en-TT, en-US, en-ZA, en-ZW, es, es-AR, es-BO, es-CL, es-CO, es-CR, es-DO, es-EC, es-ES, es-GT, es-HN, es-MX, es-NI, es-PA, es-PE, es-PR, es-PY, es-SV, es-US, es-UY, es-VE, et, et-EE, eu, eu-ES, fa, fa-IR, fi, fi-FI, fil, fil-PH, fo, fo-FO, fr, fr-BE, fr-CA, fr-CH, fr-FR, fr-LU, fr-MC, fy, fy-NL, ga, ga-IE, gd, gd-GB, gl, gl-ES, gsw, gsw-FR, gu, gu-IN, ha, ha-Latn, ha-Latn-NG, he, he-IL, hi, hi-IN, hr, hr-BA, hr-HR, hsb, hsb-DE, hu, hu-HU, hy, hy-AM, id, id-ID, ig, ig-NG, ii, ii-CN, is, is-IS, it, it-CH, it-IT, iu, iu-Cans, iu-Cans-CA, iu-Latn, iu-Latn-CA, ja, ja-JP, ka, ka-GE, kk, kk-KZ, kl, kl-GL, km, km-KH, kn, kn-IN, ko, ko-KR, kok, kok-IN, ky, ky-KG, lb, lb-LU, lo, lo-LA, lt, lt-LT, lv, lv-LV, mi, mi-NZ, mk, mk-MK, ml, ml-IN, mn, mn-Cyrl, mn-MN, mn-Mong, mn-Mong-CN, moh, moh-CA, mr, mr-IN, ms, ms-BN, ms-MY, mt, mt-MT, nb, nb-NO, ne, ne-NP, nl, nl-BE, nl-NL, nn, nn-NO, no, nso, nso-ZA, oc, oc-FR, or, or-IN, pa, pa-IN, pl, pl-PL, prs, prs-AF, ps, ps-AF, pt, pt-BR, pt-PT, qut, qut-GT, quz, quz-BO, quz-EC, quz-PE, rm, rm-CH, ro, ro-RO, ru, ru-RU, rw, rw-RW, sa, sa-IN, sah, sah-RU, se, se-FI, se-NO, se-SE, si, si-LK, sk, sk-SK, sl, sl-SI, sma, sma-NO, sma-SE, smj, smj-NO, smj-SE, smn, smn-FI, sms, sms-FI, sq, sq-AL, sr, sr-Cyrl, sr-Cyrl-BA, sr-Cyrl-CS, sr-Cyrl-ME, sr-Cyrl-RS, sr-Latn, sr-Latn-BA, sr-Latn-CS, sr-Latn-ME, sr-Latn-RS, sv, sv-FI, sv-SE, sw, sw-KE, syr, syr-SY, ta, ta-IN, te, te-IN, tg, tg-Cyrl, tg-Cyrl-TJ, th, th-TH, tk, tk-TM, tn, tn-ZA, tr, tr-TR, tt, tt-RU, tzm, tzm-Latn, tzm-Latn-DZ, ug, ug-CN, uk, uk-UA, ur, ur-PK, uz, uz-Cyrl, uz-Cyrl-UZ, uz-Latn, uz-Latn-UZ, vi, vi-VN, wo, wo-SN, xh, xh-ZA, yo, yo-NG, zh, zh-CHS, zh-CHT, zh-CN, zh-Hans, zh-Hant, zh-HK, zh-MO, zh-SG, zh-TW, zu, zu-ZA
```

##  License MIT
