import { CLASSES } from './referenceData.js'

/*
 * Mock students (spec §10.3, Phase 5a).
 *
 * 42 records, NIS 10001–10042. The first six are fixed. Rows 7–42 are
 * generated filler using the prototype's own formula, so classes cycle,
 * genders alternate and averages land between roughly 72 and 94.
 *
 * Phase 5a: `status: 'Active' | 'Inactive'` is replaced by two numeric flags:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 * All seed records start Active.
 */

const FIXED_STUDENTS = [
  ['Andi Pratama', 0, 'Male', 85.2],
  ['Budi Santoso', 0, 'Male', 78.5],
  ['Citra Dewi', 1, 'Female', 91.0],
  ['Dian Anugrah', 1, 'Male', 86.4],
  ['Eko Prasetyo', 2, 'Male', 73.8],
  ['Fani Rahmawati', 2, 'Female', 88.0],
]

const FIRST_NAMES = [
  'Gita',
  'Hadi',
  'Indra',
  'Joko',
  'Kiki',
  'Lina',
  'Maya',
  'Nanda',
  'Oka',
  'Putri',
  'Rian',
  'Sari',
]

const LAST_NAMES = ['Wijaya', 'Putra', 'Lestari', 'Saputra', 'Utami', 'Hakim']

export const students = Array.from({ length: 42 }, (_, index) => {
  const fixed = FIXED_STUDENTS[index]
  const [name, classIndex, gender, avg] = fixed ?? [
    `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[index % LAST_NAMES.length]}`,
    index % CLASSES.length,
    index % 2 ? 'Female' : 'Male',
    Number((72 + ((index * 7) % 22) + 0.4).toFixed(1)),
  ]

  return {
    nis: String(10001 + index),
    name,
    cls: CLASSES[classIndex],
    gender,
    IsActive: 1,
    IsDelete: 0,
    avg,
  }
})