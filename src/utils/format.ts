/** Coin mark that prefixes every amount in the UI, in place of the baht sign. */
const COIN_MARK = '🪙'

/**
 * Format a number as Thai baht with no decimal places, prefixed with the coin mark
 * instead of ฿: `🪙103,000`, and `-🪙1,200` for negatives.
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))

  return `${amount < 0 ? '-' : ''}${COIN_MARK}${formatted}`
}

/** Join class names, dropping falsy values. */
export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
