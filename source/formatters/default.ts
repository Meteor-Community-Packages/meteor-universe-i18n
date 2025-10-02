import { MessageFormatter, FormatterOptions } from './base';

/**
 * Default message formatter that implements the original universe:i18n format.
 * Uses {$variableName} or {$0} syntax for interpolation and pipe separator for pluralization.
 */
export class DefaultMessageFormatter implements MessageFormatter {
  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string {
    // Step 1: Apply pluralization if _count is provided
    let result = message;
    if ('_count' in params && typeof params._count === 'number') {
      result = this.pluralize(result, locale, params._count, options);
    }

    // Step 2: Interpolate variables (including _count after pluralization)
    result = this.interpolate(result, params, options);

    return result;
  }

  /**
   * Interpolates variables into the message string.
   * Supports both named parameters ({$name}) and positional parameters ({$0}).
   * @param {string} message - The message string to interpolate
   * @param {Record<string, unknown>} params - The parameters to interpolate
   * @param {FormatterOptions} options - Formatter options containing delimiters
   * @returns {string} The interpolated message string
   */
  private interpolate(
    message: string,
    params: Record<string, unknown>,
    options: FormatterOptions,
  ): string {
    let interpolated = message;

    for (const [key, value] of Object.entries(params)) {
      const tag = options.open + key + options.close;
      interpolated = interpolated.replaceAll(tag, value as string);
    }

    return interpolated;
  }

  /**
   * Applies pluralization rules to the message.
   * Uses pipe separator to split plural forms and selects based on count.
   * @param {string} message - The message string with plural forms
   * @param {string} locale - The current locale
   * @param {number} count - The count value for pluralization
   * @param {FormatterOptions} options - Formatter options containing pluralization rules
   * @returns {string} The pluralized message string
   */
  private pluralize(
    message: string,
    locale: string,
    count: number,
    options: FormatterOptions,
  ): string {
    const pluralizationRules = options.pluralizationRules;
    const index = pluralizationRules?.[locale]?.(count) ?? count;

    const forms = message.split(options.pluralizationDivider);
    const selected = forms[Math.min(index, forms.length - 1)];

    return selected;
  }
}
