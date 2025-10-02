/// <reference path="meteor_practicalmeteor_sinon.d.ts"/>
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from "sinon-chai";
import { i18n } from '../source/common';
import assert from 'assert';

chai.use(sinonChai);

describe('universe-i18n', () => {
  it('should support YAML files', async () => {
    await i18n.setLocale('fr-FR');
    assert.equal(i18n.__('common.name'), 'yml-fr');
  });

  it('should support JSON files', async () => {
    await i18n.setLocale('es-ES');
    assert.equal(i18n.__('common.name'), 'json-es-es');
  });

  it('should support all kinds of translations files', async () => {
    const cases = [
      ['de-CH', 'yml-de-ch'],
      ['el', 'yml-el'],
      ['en-GB', 'json-en-gb'],
      ['es-ES', 'json-es-es'],
      ['fr', 'yml-fr'],
      ['it-IT', 'yml-it-it'],
      ['pl-PL', 'yml-pl-pl'],
      ['tr', 'yml-tr'],
    ];
    for (const [locale, name] of cases) {
      await i18n.setLocale(locale);
      assert.equal(i18n.__('common.name'), name);
    }
  });

  it('should be able to set locale', async () => {
    await i18n.setLocale('de-DE');
    assert.equal(i18n.getLocale(), 'de-DE');
    assert.ok(i18n.setLocale('pl-PL'));
    assert.equal(i18n.getLocale(), 'pl-PL');
  });

  it('should be able to set/get translations', async () => {
    await i18n.setLocale('en-US');
    assert.ok(i18n.addTranslation('en-US', 'common', 'yes', 'Yes'));
    assert.equal(i18n.__('common.yes'), 'Yes');
    assert.ok(i18n.addTranslation('en-US', 'common.no', 'No'));
    assert.equal(i18n.__('common.no'), 'No');
    assert.ok(i18n.addTranslation('en-US', 'common.ok', 'Ok'));
    assert.equal(i18n.__('common.ok'), 'Ok');
    const params = {
      common: {
        hello: 'Hello {$name}',
      },
    };
    assert.ok(i18n.addTranslations('en-US', params));
    assert.equal(
      i18n.getTranslation('common', 'hello', { name: 'World' }),
      'Hello World',
    );
    assert.ok(
      i18n.addTranslation(
        'en-US',
        'common',
        'firstAndThird',
        'First: {$0}, Third: {$2}',
      ),
    );
    assert.equal(
      i18n.__('common', 'firstAndThird', ['a', 'b', 'c']),
      'First: a, Third: c',
    );
  });

  it('should be able to set options', async () => {
    await i18n.setLocale('en-US');
    i18n.setOptions({ open: '{{', close: '}}' });
    const params = {
      common: {
        hello: 'Hello {{name}}',
      },
    };
    assert.ok(i18n.addTranslations('en-US', params));
    assert.equal(
      i18n.getTranslation('common', 'hello', { name: 'World' }),
      'Hello World',
    );
    i18n.setOptions({ open: '{$', close: '}' });
  });
});
