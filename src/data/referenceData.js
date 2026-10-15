/* ---------------------------------------------------------------- *
 * Roles and users (Phase 4a)
 *
 * Two roles: admin (full access) and teacher (limited scope).
 * The USERS array is the mock identity table. `findUser` looks up by
 * username and password; the login page surfaces the demo credentials.
 * ---------------------------------------------------------------- */

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
}

export const USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Sarah Jenkins, M.Pd',
    role: ROLES.ADMIN,
    email: 'admin@sman1harapan.sch.id',
    phone: '+62 812-3456-7890',
    gender: 'Female / Perempuan',
    nip: '19780512 200312 2 004',
    department: 'Academic Administrator & Staff',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
  {
    username: 'budi',
    password: 'budi123',
    name: 'Budi Santoso, S.Pd',
    role: ROLES.TEACHER,
    email: 'budi@sman1harapan.sch.id',
    phone: '+62 812-1001-0001',
    gender: 'Male / Laki-laki',
    nip: '19840312 200801 1 004',
    department: 'Mathematics Teacher',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
  {
    username: 'citra',
    password: 'citra123',
    name: 'Citra Dewi, M.Si',
    role: ROLES.TEACHER,
    email: 'citra@sman1harapan.sch.id',
    phone: '+62 812-1001-0002',
    gender: 'Female / Perempuan',
    nip: '19890724 201402 2 009',
    department: 'Physics Teacher',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
  {
    username: 'andi',
    password: 'andi123',
    name: 'Andi Pratama, M.Pd',
    role: ROLES.TEACHER,
    email: 'andi@sman1harapan.sch.id',
    phone: '+62 812-1001-0003',
    gender: 'Male / Laki-laki',
    nip: '19910515 201803 1 002',
    department: 'English Teacher',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
  {
    username: 'sri',
    password: 'sri123',
    name: 'Sri Wahyuni, M.Pd',
    role: ROLES.TEACHER,
    email: 'sri@sman1harapan.sch.id',
    phone: '+62 812-1001-0004',
    gender: 'Female / Perempuan',
    nip: '19781109 200212 2 001',
    department: 'Biology Teacher',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
  {
    username: 'fauzi',
    password: 'fauzi123',
    name: 'Fauzi, S.Si',
    role: ROLES.TEACHER,
    email: 'fauzi@sman1harapan.sch.id',
    phone: '+62 812-1001-0005',
    gender: 'Male / Laki-laki',
    nip: '19860408 201101 1 007',
    department: 'Chemistry Teacher',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
  {
    username: 'rahmat',
    password: 'rahmat123',
    name: 'Rahmat Hidayat, M.Kom',
    role: ROLES.TEACHER,
    email: 'rahmat@sman1harapan.sch.id',
    phone: '+62 812-1001-0006',
    gender: 'Male / Laki-laki',
    nip: '19800101 200501 1 003',
    department: 'Sociology Teacher',
    school: 'SMA Negeri 1 Harapan Bangsa',
    status: 'Active',
  },
]

/**
 * Look up a mock user by username + password.
 * Returns the full user record (including role) or null if not found.
 * The password is checked for realism; the credentials are documented on
 * the login screen and are not secrets.
 */
export function findUser(username, password) {
  const normalizedUsername = String(username ?? '').trim().toLowerCase()
  const normalizedPassword = String(password ?? '')
  return (
    USERS.find(
      (u) => u.username === normalizedUsername && u.password === normalizedPassword,
    ) ?? null
  )
}

export const CLASSES = ['XI IPA 1', 'XI IPA 2', 'XI IPS 1']

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'English',
  'Biology',
  'Chemistry',
  'Sociology',
]

export const ACADEMIC_YEARS = ['2026/2027', '2025/2026', '2024/2025']

export const SEMESTERS = ['Ganjil (Odd)', 'Genap (Even)']

/* Teaching Assignment's semester filter additionally offers this option, which
   disables the semester condition (spec §10.5). */
export const ALL_SEMESTERS = 'All Semesters'

export const SEMESTER_OPTIONS = [...SEMESTERS, ALL_SEMESTERS]

export const TEACHERS = [
  'Budi Santoso, S.Pd',
  'Citra Dewi, M.Si',
  'Andi Pratama, M.Pd',
  'Sri Wahyuni, M.Pd',
  'Fauzi, S.Si',
  'Rahmat Hidayat, M.Kom',
]

export const TEACHER_NIP = {
  'Budi Santoso, S.Pd': '19840312 200801 1 004',
  'Citra Dewi, M.Si': '19890724 201402 2 009',
  'Andi Pratama, M.Pd': '19910515 201803 1 002',
  'Sri Wahyuni, M.Pd': '19781109 200212 2 001',
  'Fauzi, S.Si': '19860408 201101 1 007',
  'Rahmat Hidayat, M.Kom': '19800101 200501 1 003',
}

export const SUBJECT_ICONS = {
  Mathematics: 'calculate',
  Physics: 'bolt',
  English: 'translate',
  Biology: 'biotech',
  Chemistry: 'science',
  Sociology: 'groups',
}

export const MASTER_CATEGORIES = [
  'Science / MIPA',
  'Social / IPS',
  'Language & Culture',
  'General Compulsory',
]

export const GENDERS = ['Male', 'Female']

export const STUDENT_STATUSES = ['Active', 'Inactive']

export const PROFILE_GENDERS = ['Female / Perempuan', 'Male / Laki-laki']

export const GRADE_STATUSES = ['Complete', 'In Progress', 'Not Started']

export const SCORE_MIN = 0

export const SCORE_MAX = 100

/* The period the prototype treats as current: grade rosters are generated for
   2026/2027 Ganjil, and the dashboard reports it as the active period. */
export const CURRENT_YEAR = '2026/2027'

export const CURRENT_SEMESTER = 'Ganjil (Odd)'

/*
 * Class display facts, hard-coded in the prototype and preserved as such
 * (spec §10.2, §13.1 item 4). The seeded roster holds 42 students, so the
 * enrolment counts here deliberately do not match the data.
 */
export const CLASS_FACTS = {
  'XI IPA 1': { track: 'MIPA', room: 204, enrolled: 32, tile: 'pink' },
  'XI IPA 2': { track: 'MIPA', room: 205, enrolled: 30, tile: 'blue' },
  'XI IPS 1': { track: 'IPS', room: 301, enrolled: 28, tile: 'blue' },
}

/* "MIPA • Room 204" / "IPS • Room 301" as shown in Grade Management */
export function classRoomLabel(cls) {
  const facts = CLASS_FACTS[cls]
  return facts ? `${facts.track} • Room ${facts.room}` : ''
}

export function classEnrolled(cls) {
  return CLASS_FACTS[cls] ? CLASS_FACTS[cls].enrolled : 0
}

/* Transcript track wording (spec §5.3) */
export function classTrackLabel(cls) {
  return cls.includes('IPA') ? 'Science & Mathematics Track' : 'Social Sciences Track'
}

/* The prototype shows only the first word of a semester label: "Ganjil" */
export function shortSemester(semester) {
  return semester.split(' ')[0]
}

export function teacherNip(teacher) {
  return TEACHER_NIP[teacher] || ''
}

export function subjectIcon(subject) {
  return SUBJECT_ICONS[subject] || 'school'
}

/* ---------------------------------------------------------------- *
 * Status flag helpers (Phase 5a)
 *
 * Every CRUD entity (Students, Master items, Teaching assignments) uses the
 * same two-flag model:
 *   IsActive : 1 = active tab, 0 = inactive tab
 *   IsDelete : 1 = soft-deleted (hidden from both tabs)
 *
 * These two helpers convert a record to its display label and badge variant,
 * so pages do not repeat the flag logic.
 * ---------------------------------------------------------------- */

export function activeStatusLabel(record) {
  if (!record) return ''
  if (record.IsDelete === 1) return 'Deleted'
  return record.IsActive === 1 ? 'Active' : 'Inactive'
}

export function activeStatusVariant(record) {
  if (!record) return 'gray'
  if (record.IsDelete === 1) return 'gray'
  return record.IsActive === 1 ? 'blue' : 'gray'
}

/* Filter helper — returns true when the record should appear in a list. */
export function isVisible(record) {
  return record && record.IsDelete !== 1
}