import test from 'node:test'
import assert from 'node:assert/strict'
import { isTheme, resolveTheme } from '../shared/utils/theme.js'

test('accepts only supported themes', () => {
  assert.equal(isTheme('light'), true)
  assert.equal(isTheme('dark'), true)
  assert.equal(isTheme('system'), false)
  assert.equal(isTheme(null), false)
})

test('stored theme overrides the system preference', () => {
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
})

test('system preference is used without a valid stored theme', () => {
  assert.equal(resolveTheme(null, true), 'dark')
  assert.equal(resolveTheme('invalid', false), 'light')
})
