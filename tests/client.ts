import { i18n } from '../source/client';
import assert from 'assert';
import chai from 'chai';

const expect = chai.expect;




describe('universe-i18n - client', () => {
  it('should load translations incrementally', async () => {
    const locale = 'it-IT';
    assert.notEqual(i18n.isLoaded(locale), true);
    await i18n.setLocale(locale);
    assert.equal(i18n.isLoaded(locale), true);
    assert.equal(i18n.getLocale(), locale);
  });

  it('should list only available languages', async () => {
    const locale = 'zh-CN';
    assert.notEqual(i18n.isLoaded(locale), true);
    await i18n.setLocale(locale);
    assert.equal(i18n.isLoaded(locale), true);
    assert.equal(i18n.getLocale(), locale);
    assert.strictEqual(!i18n.getLocales().includes(i18n.getLocale()), true);
  });
});
