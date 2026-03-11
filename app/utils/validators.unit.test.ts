import { describe, it, expect } from 'vitest'
import { isAlphaNum } from './validators'

describe('isAlphaNum', () => {
  it('returns true for alphanumeric strings', () => {
    expect(isAlphaNum('abc123')).toBe(true)
    expect(isAlphaNum('ABC456')).toBe(true)
    expect(isAlphaNum('123456')).toBe(true)
    expect(isAlphaNum('abcdef')).toBe(true)
  })

  it('returns false for strings with special characters', () => {
    expect(isAlphaNum('abc-123')).toBe(false)
    expect(isAlphaNum('abc_123')).toBe(false)
    expect(isAlphaNum('abc 123')).toBe(false)
    expect(isAlphaNum('abc.123')).toBe(false)
  })

  it('returns false for empty strings', () => {
    expect(isAlphaNum('')).toBe(false)
  })

  it('returns false for strings with only special characters', () => {
    expect(isAlphaNum('!@#$%^')).toBe(false)
  })
})
