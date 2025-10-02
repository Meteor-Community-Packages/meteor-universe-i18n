import { i18n } from '../source/server';
import assert from 'assert';
import chai from 'chai';

const expect = chai.expect;

describe('universe-i18n - server', () => {
  it('should return object from getCache', () => {
    assert.equal(typeof i18n.getCache(), 'object');
    assert.equal(typeof i18n.getCache('en-US'), 'object');
    assert.equal(typeof i18n.getCache('it-IT'), 'object');
  });

  it('should be able to call getYML', () => {
    const cache = i18n.getCache('it-IT');
    assert.equal(typeof cache, 'object');
    assert.equal(typeof cache.getYML('it-IT'), 'string');
    assert.equal(typeof cache.getYML('it-IT', 'common'), 'string');
  });

  it('should be able to call getJSON', () => {
    const cache = i18n.getCache('es-ES');
    assert.equal(typeof cache, 'object');
    assert.equal(typeof cache.getYML('es-ES'), 'string');
    assert.equal(typeof cache.getYML('es-ES', 'common'), 'string');
  });
});
