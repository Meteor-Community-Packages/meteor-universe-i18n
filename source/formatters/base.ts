/**
 * Interface for message formatters.
 * Allows pluggable formatting strategies for translation strings.
 */
export interface MessageFormatter {
  /**
   * Formats a translation message with the provided parameters.
   *
   * @param message - The translation message string
   * @param params - Parameters to interpolate into the message
   * @param locale - The current locale
   * @param options - Additional formatting options (e.g., open/close delimiters, pluralization divider)
   * @returns The formatted message string
   */
  format(
    message: string,
    params: Record<string, unknown>,
    locale: string,
    options: FormatterOptions,
  ): string;
}

/**
 * Options passed to the formatter.
 */
export interface FormatterOptions {
  /** Opening delimiter for variable interpolation (e.g., '{$') */
  open: string;
  /** Closing delimiter for variable interpolation (e.g., '}') */
  close: string;
  /** Divider for pluralization forms (e.g., ' | ') */
  pluralizationDivider: string;
  /** Custom pluralization rules per locale */
  pluralizationRules: Record<string, (count: number) => number>;
}
