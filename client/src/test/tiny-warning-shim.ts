/** ESM shim for tiny-warning to avoid CJS loading in Vitest. */
function warning(condition: unknown, message: string): void {
  if (condition) return
  if (typeof console !== 'undefined') {
    console.warn('Warning: ' + message)
  }
}

export default warning
