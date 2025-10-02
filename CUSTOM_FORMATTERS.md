# Custom Message Formatters

As of version 3.1, `universe:i18n` supports pluggable message formatters, allowing you to use different message format syntaxes beyond the default format.

## Table of Contents

- [Overview](#overview)
- [Default Formatter](#default-formatter)
- [Creating a Custom Formatter](#creating-a-custom-formatter)
- [Using a Custom Formatter](#using-a-custom-formatter)
- [ICU Message Format Example](#icu-message-format-example)
- [API Reference](#api-reference)

## Overview

The formatter system allows you to:

- Use different message format syntaxes (e.g., ICU MessageFormat, i18next format, etc.)
- Create custom interpolation and pluralization logic
- Integrate with existing i18n libraries
- Maintain backward compatibility with the default format

## Default Formatter

The package ships with a `DefaultMessageFormatter` that implements the original universe:i18n format:

**Interpolation:**
```yml
greeting: "Hello {$name}!"
```

```js
i18n.__('greeting', { name: 'World' }); // "Hello World!"
```

**Pluralization:**
```yml
items: "no items | one item | {$_count} items"
```

```js
i18n.__('items', { _count: 0 }); // "no items"
i18n.__('items', { _count: 1 }); // "one item"
i18n.__('items', { _count: 5 }); // "5 items"
```

## Creating a Custom Formatter

To create a custom formatter, implement the `MessageFormatter` interface:

```typescript
import { MessageFormatter, FormatterOptions } from 'meteor/universe:i18n';

class MyCustomFormatter implements MessageFormatter {
  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    // Your custom formatting logic here
    return formattedMessage;
  }
}
```

### MessageFormatter Interface

```typescript
interface MessageFormatter {
  /**
   * Formats a translation message with the provided parameters.
   * 
   * @param message - The translation message string
   * @param params - Parameters to interpolate into the message
   * @param locale - The current locale
   * @param options - Additional formatting options
   * @returns The formatted message string
   */
  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string;
}
```

### FormatterOptions

The `options` parameter provides access to configuration:

```typescript
interface FormatterOptions {
  /** Opening delimiter for variable interpolation (e.g., '{$') */
  open: string;
  
  /** Closing delimiter for variable interpolation (e.g., '}') */
  close: string;
  
  /** Divider for pluralization forms (e.g., ' | ') */
  pluralizationDivider: string;
  
  /** Custom pluralization rules per locale */
  pluralizationRules: Record<string, (count: number) => number>;
}
```

## Using a Custom Formatter

Set your custom formatter using `setOptions()`:

```typescript
import i18n from 'meteor/universe:i18n';
import { MyCustomFormatter } from './formatters/MyCustomFormatter';

// Create an instance of your formatter
const customFormatter = new MyCustomFormatter();

// Set it as the active formatter
i18n.setOptions({
  messageFormatter: customFormatter,
});
```

**Important:** Set the formatter before loading any translations or calling translation functions.

## ICU Message Format Example

Here's an example of implementing an ICU MessageFormat formatter using the `intl-messageformat` library:

### 1. Install the dependency

```bash
npm install intl-messageformat
```

### 2. Create the ICU formatter

```typescript
// formatters/ICUMessageFormatter.ts
import IntlMessageFormat from 'intl-messageformat';
import { MessageFormatter, FormatterOptions } from 'meteor/universe:i18n';

export class ICUMessageFormatter implements MessageFormatter {
  private cache = new Map<string, IntlMessageFormat>();

  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    const cacheKey = `${locale}:${message}`;

    // Check cache for compiled message
    if (!this.cache.has(cacheKey)) {
      try {
        this.cache.set(
          cacheKey,
          new IntlMessageFormat(message, locale)
        );
      } catch (error) {
        console.error('ICU MessageFormat compilation error:', error);
        return message;
      }
    }

    try {
      const formatter = this.cache.get(cacheKey)!;
      return formatter.format(params) as string;
    } catch (error) {
      console.error('ICU MessageFormat formatting error:', error);
      return message;
    }
  }
}
```

### 3. Use the ICU formatter

```typescript
import i18n from 'meteor/universe:i18n';
import { ICUMessageFormatter } from './formatters/ICUMessageFormatter';

i18n.setOptions({
  messageFormatter: new ICUMessageFormatter(),
});
```

### 4. Write ICU-formatted translations

```yml
# en.i18n.yml
_locale: en

# Simple interpolation
greeting: "Hello {name}!"

# Pluralization
items: "{count, plural, =0 {no items} one {# item} other {# items}}"

# Select (gender)
invitation: "{gender, select, male {He is invited} female {She is invited} other {They are invited}}"

# Number formatting
price: "Price: {amount, number, ::currency/USD}"

# Date formatting
appointment: "Your appointment is on {date, date, short}"
```

### 5. Use the translations

```typescript
// Simple interpolation
i18n.__('greeting', { name: 'Alice' }); 
// "Hello Alice!"

// Pluralization
i18n.__('items', { count: 0 }); // "no items"
i18n.__('items', { count: 1 }); // "1 item"
i18n.__('items', { count: 5 }); // "5 items"

// Select
i18n.__('invitation', { gender: 'female' }); 
// "She is invited"

// Number formatting
i18n.__('price', { amount: 1234.56 }); 
// "Price: $1,234.56"

// Date formatting
i18n.__('appointment', { date: new Date('2025-10-15') }); 
// "Your appointment is on 10/15/25"
```

## API Reference

### Exported Types

```typescript
import {
  MessageFormatter,
  FormatterOptions,
  DefaultMessageFormatter,
} from 'meteor/universe:i18n';
```

### Setting a Formatter

```typescript
i18n.setOptions({
  messageFormatter: new MyCustomFormatter(),
});
```

### Accessing the Current Formatter

```typescript
const currentFormatter = i18n.options.messageFormatter;
```

## Best Practices

1. **Cache Compiled Messages**: If your formatter compiles messages (like ICU), cache the compiled results for better performance.

2. **Error Handling**: Always handle errors gracefully and return the original message if formatting fails.

3. **Memory Management**: For long-running applications, consider implementing cache size limits or LRU eviction.

4. **Type Safety**: Use TypeScript to ensure your formatter implements the interface correctly.

5. **Testing**: Write comprehensive tests for your custom formatter with various message patterns.

6. **Documentation**: Document the message format syntax your formatter supports for other developers.

## Migration from Default to Custom Format

If you're migrating from the default format to a custom format (e.g., ICU):

1. **Gradual Migration**: You can use different formatters for different locales if needed by creating a wrapper formatter that delegates based on locale.

2. **Conversion Script**: Write a script to convert your existing translation files to the new format.

3. **Testing**: Thoroughly test all translations after migration to ensure nothing breaks.

4. **Fallback**: Consider implementing a fallback mechanism that tries the new format first, then falls back to the old format if parsing fails.

## Example: Hybrid Formatter

Here's an example of a formatter that supports both default and ICU formats:

```typescript
import { MessageFormatter, FormatterOptions, DefaultMessageFormatter } from 'meteor/universe:i18n';
import { ICUMessageFormatter } from './ICUMessageFormatter';

export class HybridFormatter implements MessageFormatter {
  private defaultFormatter = new DefaultMessageFormatter();
  private icuFormatter = new ICUMessageFormatter();

  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    // Detect format based on message syntax
    // ICU format typically uses {variable} without {$
    const isICU = message.includes('{') && !message.includes('{$');

    if (isICU) {
      return this.icuFormatter.format(message, params, locale, options);
    } else {
      return this.defaultFormatter.format(message, params, locale, options);
    }
  }
}
```
