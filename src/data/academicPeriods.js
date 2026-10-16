/*
 * Mock academic periods (Batch 2).
 *
 * Fields:
 *   year      – academic year, e.g. '2026/2027' (format YYYY/YYYY)
 *   startDate – ISO date string 'YYYY-MM-DD'
 *   endDate   – ISO date string 'YYYY-MM-DD' (must be >= startDate)
 *   semester  – semester designation, uses the existing SEMESTERS convention
 *               'Ganjil (Odd)' or 'Genap (Even)'
 *   type      – short classification, 'Ganjil' or 'Genap'
 *
 * The two CRUD flags are the same ones used across the rest of the app:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 *
 * Seed data covers three academic years, both semester types, and no
 * overlapping ranges within the same year (see the form's overlap check).
 */

export const PERIOD_TYPES = ['Ganjil', 'Genap']

const SEED = [
  ['2026/2027', '2026-07-15', '2026-12-20', 'Ganjil (Odd)', 'Ganjil'],
  ['2026/2027', '2027-01-10', '2027-06-20', 'Genap (Even)', 'Genap'],
  ['2025/2026', '2025-07-14', '2025-12-19', 'Ganjil (Odd)', 'Ganjil'],
  ['2025/2026', '2026-01-09', '2026-06-19', 'Genap (Even)', 'Genap'],
  ['2024/2025', '2024-07-15', '2024-12-20', 'Ganjil (Odd)', 'Ganjil'],
  ['2024/2025', '2025-01-08', '2025-06-18', 'Genap (Even)', 'Genap'],
]

export const academicPeriods = SEED.map(
  ([year, startDate, endDate, semester, type], index) => ({
    id: index + 1,
    year,
    startDate,
    endDate,
    semester,
    type,
    IsActive: 1,
    IsDelete: 0,
    updated: 'Today',
  }),
)