/*
 * Field-level checks (spec §8.6, §10.6).
 *
 * The prototype shows no inline error messages: every failure surfaces as a
 * toast, so these return booleans and the caller picks the wording.
 */

/** text, "@", text — with no spaces anywhere (spec §10.6). */
export function isValidEmail(value) {
  return /^\S+@\S+$/.test(String(value ?? '').trim())
}

/**
 * At least 8 characters, containing a letter, a digit and a special symbol
 * (spec §5.3 requirement chips, §10.6).
 */
export function isValidPassword(value) {
  const text = String(value ?? '')
  return text.length >= 8 && /[a-z]/i.test(text) && /\d/.test(text) && /[^\w\s]/.test(text)
}

/** A required text field that must not be blank or whitespace only. */
export function isFilled(value) {
  return String(value ?? '').trim().length > 0
}

/** A select that must differ from its "Select…" placeholder. */
export function isSelected(value, placeholder = 'Select') {
  return isFilled(value) && !String(value).startsWith(placeholder)
}