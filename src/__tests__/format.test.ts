import { describe, expect, it } from 'vitest'
import { classNames, formatCurrency } from '../utils/format'

describe('formatCurrency', () => {
  it('formats THB with no decimal places', () => {
    expect(formatCurrency(103000)).toBe('฿103,000')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('฿0')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-1200)).toBe('-฿1,200')
  })
})

describe('classNames', () => {
  it('joins truthy strings with spaces', () => {
    expect(classNames('a', 'b', 'c')).toBe('a b c')
  })

  it('filters out falsy values', () => {
    expect(classNames('a', false, null, undefined, 'b')).toBe('a b')
  })
})
