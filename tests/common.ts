import { i18n, MessageFormatter, FormatterOptions } from '../source/common';
import assert from 'assert';

// Simple test formatter that prefixes all messages with "TEST:"
class TestFormatter implements MessageFormatter {
  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    return `TEST:${message}`;
  }
}

// Formatter that uses parameters to verify they're passed correctly
class InterpolatingFormatter implements MessageFormatter {
  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    // Simple interpolation: replace {{key}} with value
    let result = message;
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(`{{${key}}}`, String(value));
    }
    return result;
  }
}

// Formatter that captures what it receives for testing
class CapturingFormatter implements MessageFormatter {
  public lastMessage = '';
  public lastParams: Record<string, unknown> = {};
  public lastLocale = '';
  public lastOptions: FormatterOptions | null = null;

  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    this.lastMessage = message;
    this.lastParams = { ...params };
    this.lastLocale = locale;
    this.lastOptions = { ...options };
    return message;
  }
}

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

  it('should use custom message formatter when set', async () => {
    await i18n.setLocale('en-US');
    
    // Add a test translation
    i18n.addTranslation('en-US', 'test', 'customFormatter', 'Original message');
    
    // Verify default formatter works
    assert.equal(
      i18n.__('test.customFormatter'),
      'Original message',
    );
    
    // Set custom formatter
    const testFormatter = new TestFormatter();
    i18n.setOptions({ messageFormatter: testFormatter });
    
    // Verify custom formatter is being used (should prefix with "TEST:")
    assert.equal(
      i18n.__('test.customFormatter'),
      'TEST:Original message',
    );
    
    // Test with parameters (custom formatter ignores them in this simple implementation)
    assert.equal(
      i18n.__('test.customFormatter', { name: 'World' }),
      'TEST:Original message',
    );
    
    // Restore default formatter for other tests
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
    
    // Verify default formatter is restored
    assert.equal(
      i18n.__('test.customFormatter'),
      'Original message',
    );
  });

  it('should pass parameters to custom formatter', async () => {
    await i18n.setLocale('en-US');
    
    // Add translation with custom format
    i18n.addTranslation('en-US', 'test', 'greeting', 'Hello {{name}}!');
    
    // Set interpolating formatter
    const interpolatingFormatter = new InterpolatingFormatter();
    i18n.setOptions({ messageFormatter: interpolatingFormatter });
    
    // Verify parameters are passed and used
    assert.equal(
      i18n.__('test.greeting', { name: 'Alice' }),
      'Hello Alice!',
    );
    
    assert.equal(
      i18n.__('test.greeting', { name: 'Bob' }),
      'Hello Bob!',
    );
    
    // Restore default formatter
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
  });

  it('should pass locale and options to custom formatter', async () => {
    await i18n.setLocale('fr-FR');
    
    // Add translation
    i18n.addTranslation('fr-FR', 'test', 'capture', 'Test message');
    
    // Set capturing formatter
    const capturingFormatter = new CapturingFormatter();
    i18n.setOptions({ messageFormatter: capturingFormatter });
    
    // Call translation
    i18n.__('test.capture', { foo: 'bar', _count: 5 });
    
    // Verify locale was passed
    assert.equal(capturingFormatter.lastLocale, 'fr-FR');
    
    // Verify message was passed
    assert.equal(capturingFormatter.lastMessage, 'Test message');
    
    // Verify params were passed
    assert.equal(capturingFormatter.lastParams.foo, 'bar');
    assert.equal(capturingFormatter.lastParams._count, 5);
    
    // Verify options were passed
    assert.ok(capturingFormatter.lastOptions);
    assert.equal(capturingFormatter.lastOptions!.open, '{$');
    assert.equal(capturingFormatter.lastOptions!.close, '}');
    assert.equal(capturingFormatter.lastOptions!.pluralizationDivider, ' | ');
    
    // Restore default formatter
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
  });

  it('should handle default formatter with pluralization', async () => {
    await i18n.setLocale('en-US');
    
    // Add pluralized translation
    i18n.addTranslation('en-US', 'test', 'items', 'no items | one item | {$_count} items');
    
    // Ensure default formatter is active
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
    
    // Test pluralization
    assert.equal(i18n.__('test.items', { _count: 0 }), 'no items');
    assert.equal(i18n.__('test.items', { _count: 1 }), 'one item');
    assert.equal(i18n.__('test.items', { _count: 2 }), '2 items');
    assert.equal(i18n.__('test.items', { _count: 10 }), '10 items');
  });

  it('should handle custom pluralization rules with formatter', async () => {
    await i18n.setLocale('pl-PL');
    
    // Add Polish pluralization rule
    i18n.setOptions({
      pluralizationRules: {
        'pl-PL': (count: number) => {
          const tens = count % 100;
          const units = tens % 10;
          
          if (tens > 10 && tens < 20) return 2;
          if (units === 0) return 2;
          if (tens === 1 && units === 1) return 0;
          if (units > 1 && units < 5) return 1;
          return 2;
        },
      },
    });
    
    // Add pluralized translation
    i18n.addTranslation('pl-PL', 'test', 'phones', '{$_count} telefon | {$_count} telefony | {$_count} telefonów');
    
    // Ensure default formatter is active
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ 
      messageFormatter: new DefaultMessageFormatter(),
      pluralizationRules: {
        'pl-PL': (count: number) => {
          const tens = count % 100;
          const units = tens % 10;
          
          if (tens > 10 && tens < 20) return 2;
          if (units === 0) return 2;
          if (tens === 1 && units === 1) return 0;
          if (units > 1 && units < 5) return 1;
          return 2;
        },
      },
    });
    
    // Test Polish pluralization
    assert.equal(i18n.__('test.phones', { _count: 1 }), '1 telefon');
    assert.equal(i18n.__('test.phones', { _count: 2 }), '2 telefony');
    assert.equal(i18n.__('test.phones', { _count: 5 }), '5 telefonów');
    assert.equal(i18n.__('test.phones', { _count: 22 }), '22 telefony');
    
    // Reset pluralization rules
    i18n.setOptions({ pluralizationRules: {} });
  });

  it('should handle switching formatters multiple times', async () => {
    await i18n.setLocale('en-US');
    
    i18n.addTranslation('en-US', 'test', 'switch', 'Message');
    
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    const testFormatter = new TestFormatter();
    const defaultFormatter = new DefaultMessageFormatter();
    
    // Start with default
    i18n.setOptions({ messageFormatter: defaultFormatter });
    assert.equal(i18n.__('test.switch'), 'Message');
    
    // Switch to test formatter
    i18n.setOptions({ messageFormatter: testFormatter });
    assert.equal(i18n.__('test.switch'), 'TEST:Message');
    
    // Switch back to default
    i18n.setOptions({ messageFormatter: defaultFormatter });
    assert.equal(i18n.__('test.switch'), 'Message');
    
    // Switch to test again
    i18n.setOptions({ messageFormatter: testFormatter });
    assert.equal(i18n.__('test.switch'), 'TEST:Message');
    
    // Final restore
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
  });

  it('should handle formatter with missing translation', async () => {
    await i18n.setLocale('en-US');
    
    // Use a capturing formatter to verify it receives the key when translation is missing
    const capturingFormatter = new CapturingFormatter();
    i18n.setOptions({ messageFormatter: capturingFormatter });
    
    // Request a non-existent translation
    const result = i18n.__('test.nonExistent');
    
    // When hideMissing is false (default), the formatter receives the key itself
    assert.equal(capturingFormatter.lastMessage, 'test.nonExistent');
    assert.equal(result, 'test.nonExistent');
    
    // Restore default formatter
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
  });

  it('should handle formatter with special characters', async () => {
    await i18n.setLocale('en-US');
    
    i18n.addTranslation('en-US', 'test', 'special', 'Message with $pecial ch@racters & symbols!');
    
    const testFormatter = new TestFormatter();
    i18n.setOptions({ messageFormatter: testFormatter });
    
    assert.equal(
      i18n.__('test.special'),
      'TEST:Message with $pecial ch@racters & symbols!',
    );
    
    // Restore default formatter
    const { DefaultMessageFormatter } = await import('../source/formatters/default');
    i18n.setOptions({ messageFormatter: new DefaultMessageFormatter() });
  });
});
