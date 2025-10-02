import { MessageFormatter, FormatterOptions } from './base';
/**
 * Default message formatter that implements the original universe:i18n format.
 * Uses {$variableName} or {$0} syntax for interpolation and pipe separator for pluralization.
 */
export declare class DefaultMessageFormatter implements MessageFormatter {
    format(message: string, params: Record<string, unknown>, locale: string, options: FormatterOptions): string;
    /**
     * Interpolates variables into the message string.
     * Supports both named parameters ({$name}) and positional parameters ({$0}).
     */
    private interpolate;
    /**
     * Applies pluralization rules to the message.
     * Uses pipe separator to split plural forms and selects based on count.
     */
    private pluralize;
}
//# sourceMappingURL=default.d.ts.map