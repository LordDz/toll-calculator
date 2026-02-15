/**
 * Detects whether the user's locale uses 24-hour time (e.g. 13:00) or 12-hour
 * (e.g. 1:00 PM). Uses the browser's Intl API and default locale.
 *
 * @returns true if the locale uses 24-hour format, false for 12-hour (AM/PM).
 */
export function isLocale24Hour(): boolean {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric' })
    const parts = formatter.formatToParts(new Date(2000, 0, 1, 13, 0))
    const hasDayPeriod = parts.some((p) => p.type === 'dayPeriod')
    return !hasDayPeriod
  } catch {
    return true
  }
}
