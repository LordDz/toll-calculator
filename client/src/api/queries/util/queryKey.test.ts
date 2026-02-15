import { describe, it, expect } from 'vitest'
import { getQueryKey } from './queryKey'

describe('getQueryKey', () => {
  it('returns only baseKey when no params are passed', () => {
    expect(getQueryKey('tolls')).toEqual(['tolls'])
  })

  it('appends string params to the key array', () => {
    expect(getQueryKey('tolls', 'list')).toEqual(['tolls', 'list'])
    expect(getQueryKey('toll', 'detail', '123')).toEqual(['toll', 'detail', '123'])
  })

  it('appends number params and converts them to strings', () => {
    expect(getQueryKey('tolls', 1)).toEqual(['tolls', '1'])
    expect(getQueryKey('toll', 42, 100)).toEqual(['toll', '42', '100'])
  })

  it('filters out undefined params', () => {
    expect(getQueryKey('tolls', undefined)).toEqual(['tolls'])
    expect(getQueryKey('toll', 'a', undefined, 'b')).toEqual(['toll', 'a', 'b'])
    expect(getQueryKey('toll', undefined, undefined)).toEqual(['toll'])
  })

  it('handles mixed string, number, and undefined params', () => {
    expect(getQueryKey('toll', 'list', 1, undefined, 'active')).toEqual([
      'toll',
      'list',
      '1',
      'active',
    ])
  })
})
