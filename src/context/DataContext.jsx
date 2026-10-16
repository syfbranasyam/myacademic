import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

import {
  CURRENT_SEMESTER,
  CURRENT_YEAR,
  GRADE_STATUSES,
} from '../data/referenceData.js'
import { classes as seedClasses } from '../data/classes.js'
import { academicPeriods as seedAcademicPeriods } from '../data/academicPeriods.js'
import { gradeScales as seedGradeScales } from '../data/gradeScales.js'
import { gradeRosters as seedRosters } from '../data/gradeRosters.js'
import { gradeScores as seedGradeScores } from '../data/gradeScores.js'
import { masterItems as seedMasterItems } from '../data/masterItems.js'
import { students as seedStudents } from '../data/students.js'
import { teachingAssignments as seedAssignments } from '../data/teachingAssignments.js'

/*
 * The single data seam (spec §12.2, revision Phases 5 & 6).
 *
 * Every CRUD entity carries two numeric flags (IsActive, IsDelete). Rosters
 * also carry a grading workflow `status` (Complete / In Progress / Not Started)
 * which is separate from the CRUD flags.
 *
 * All deletes are soft deletes via flags. Roster soft-delete still removes the
 * associated scores from gradeScores, preserving the correction C-7 rule
 * (spec §13.1 item 14).
 *
 * Integration pass: four derived option sets are exposed so pages can render
 * class / subject / year / semester dropdowns directly from the CRUD data
 * instead of the legacy static constants. Soft-deleted records are excluded
 * automatically, and every consumer re-renders when the underlying slice
 * changes — no separate sync logic required.
 */

const DataContext = createContext(null)

const FIRST_GENERATED_ID = 1000

const COMPLETE = GRADE_STATUSES[0]
const IN_PROGRESS = GRADE_STATUSES[1]
const NOT_STARTED = GRADE_STATUSES[2]

const isFilledScore = (value) =>
  value !== '' && value !== null && value !== undefined && !Number.isNaN(value)

const highestNis = (list) =>
  list.length === 0 ? 10000 : Math.max(...list.map((student) => Number(student.nis)))

const isVisible = (record) => record && record.IsDelete !== 1

export function DataProvider({ children }) {
  const [students, setStudents] = useState(seedStudents)
  const [masterItems, setMasterItems] = useState(seedMasterItems)
  const [assignments, setAssignments] = useState(seedAssignments)
  const [rosters, setRosters] = useState(seedRosters)
  const [gradeScores, setGradeScores] = useState(seedGradeScores)
  const [classes, setClasses] = useState(seedClasses)
  const [academicPeriods, setAcademicPeriods] = useState(seedAcademicPeriods)
  const [gradeScales, setGradeScales] = useState(seedGradeScales)

  const idRef = useRef(FIRST_GENERATED_ID)
  const nextId = useCallback(() => {
    const id = idRef.current
    idRef.current += 1
    return id
  }, [])

  const nextNis = String(highestNis(students) + 1)

  /* ================================================================
   * Derived option sets (integration pass)
   *
   * Every dropdown / filter that previously read from a static constant now
   * reads from one of these. They update automatically whenever the
   * corresponding slice changes, so Create / Update / Delete in the source
   * module are reflected everywhere.
   *
   * Filtering rule: `IsDelete !== 1`. Records on the Inactive tab remain
   * available for selection — `IsActive` is a display-tab flag, not a
   * "disabled" flag.
   * ================================================================ */

  const availableClasses = useMemo(
    () => classes.filter((c) => c.IsDelete !== 1),
    [classes],
  )

  const availableSubjects = useMemo(
    () => masterItems.filter((m) => m.IsDelete !== 1),
    [masterItems],
  )

  const availableYears = useMemo(() => {
    const seen = new Set()
    academicPeriods
      .filter((p) => p.IsDelete !== 1)
      .forEach((p) => seen.add(p.year))
    /* Descending: newest academic year first */
    return Array.from(seen).sort().reverse()
  }, [academicPeriods])

  const availableSemesters = useMemo(() => {
    const seen = new Set()
    const ordered = []
    academicPeriods
      .filter((p) => p.IsDelete !== 1)
      .forEach((p) => {
        if (!seen.has(p.semester)) {
          seen.add(p.semester)
          ordered.push(p.semester)
        }
      })
    return ordered
  }, [academicPeriods])

  /* ================================================================
   * Students
   * ================================================================ */

  const addStudent = useCallback(({ name, cls, gender, IsActive }) => {
    setStudents((previous) => [
      ...previous,
      {
        nis: String(highestNis(previous) + 1),
        name,
        cls,
        gender,
        IsActive: typeof IsActive === 'number' ? IsActive : 1,
        IsDelete: 0,
        avg: Number((75 + Math.random() * 15).toFixed(1)),
      },
    ])
    return true
  }, [])

  const updateStudent = useCallback((nis, patch) => {
    setStudents((previous) =>
      previous.map((student) => (student.nis === nis ? { ...student, ...patch } : student)),
    )
    return true
  }, [])

  const deleteStudent = useCallback((nis) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.nis === nis ? { ...student, IsActive: 0, IsDelete: 1 } : student,
      ),
    )
    return true
  }, [])

  const bulkSetStudentStatus = useCallback((nisList, status) => {
    const set = new Set(nisList.map(String))
    setStudents((previous) =>
      previous.map((student) =>
        set.has(String(student.nis)) && student.IsDelete === 0
          ? { ...student, IsActive: status }
          : student,
      ),
    )
    return true
  }, [])

  const bulkDeleteStudents = useCallback((nisList) => {
    const set = new Set(nisList.map(String))
    setStudents((previous) =>
      previous.map((student) =>
        set.has(String(student.nis))
          ? { ...student, IsActive: 0, IsDelete: 1 }
          : student,
      ),
    )
    return true
  }, [])

  /* ================================================================
   * Academic Master (subjects)
   * ================================================================ */

  const addMasterItem = useCallback(
    (item) => {
      if (masterItems.some((entry) => entry.code === item.code && entry.IsDelete === 0)) {
        return false
      }
      setMasterItems((previous) => [
        {
          ...item,
          IsActive: typeof item.IsActive === 'number' ? item.IsActive : 1,
          IsDelete: 0,
          updated: 'Today',
        },
        ...previous,
      ])
      return true
    },
    [masterItems],
  )

  const updateMasterItem = useCallback(
    (code, patch) => {
      const nextCode = (patch.code ?? code).toUpperCase()
      if (
        masterItems.some(
          (entry) =>
            entry.code === nextCode && entry.code !== code && entry.IsDelete === 0,
        )
      ) {
        return false
      }
      setMasterItems((previous) =>
        previous.map((entry) =>
          entry.code === code ? { ...entry, ...patch, code: nextCode, updated: 'Today' } : entry,
        ),
      )
      return true
    },
    [masterItems],
  )

  const deleteMasterItem = useCallback((code) => {
    setMasterItems((previous) =>
      previous.map((entry) =>
        entry.code === code ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  const bulkSetMasterStatus = useCallback((codes, status) => {
    const set = new Set(codes.map(String))
    setMasterItems((previous) =>
      previous.map((entry) =>
        set.has(String(entry.code)) && entry.IsDelete === 0
          ? { ...entry, IsActive: status }
          : entry,
      ),
    )
    return true
  }, [])

  const bulkDeleteMaster = useCallback((codes) => {
    const set = new Set(codes.map(String))
    setMasterItems((previous) =>
      previous.map((entry) =>
        set.has(String(entry.code))
          ? { ...entry, IsActive: 0, IsDelete: 1 }
          : entry,
      ),
    )
    return true
  }, [])

  /* ================================================================
   * Classes
   * ================================================================ */

  const addClass = useCallback(
    (item) => {
      if (
        classes.some(
          (entry) =>
            entry.cls.toLowerCase() === String(item.cls).toLowerCase() &&
            entry.IsDelete === 0,
        )
      ) {
        return false
      }
      setClasses((previous) => [
        {
          ...item,
          id: nextId(),
          IsActive: typeof item.IsActive === 'number' ? item.IsActive : 1,
          IsDelete: 0,
          updated: 'Today',
        },
        ...previous,
      ])
      return true
    },
    [classes, nextId],
  )

  const updateClass = useCallback(
    (id, patch) => {
      const nextName = String(patch.cls ?? '')
      if (
        nextName &&
        classes.some(
          (entry) =>
            entry.id !== id &&
            entry.IsDelete === 0 &&
            entry.cls.toLowerCase() === nextName.toLowerCase(),
        )
      ) {
        return false
      }
      setClasses((previous) =>
        previous.map((entry) =>
          entry.id === id ? { ...entry, ...patch, updated: 'Today' } : entry,
        ),
      )
      return true
    },
    [classes],
  )

  const deleteClass = useCallback((id) => {
    setClasses((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  const bulkSetClassStatus = useCallback((ids, status) => {
    const set = new Set(ids.map(Number))
    setClasses((previous) =>
      previous.map((entry) =>
        set.has(entry.id) && entry.IsDelete === 0
          ? { ...entry, IsActive: status }
          : entry,
      ),
    )
    return true
  }, [])

  const bulkDeleteClasses = useCallback((ids) => {
    const set = new Set(ids.map(Number))
    setClasses((previous) =>
      previous.map((entry) =>
        set.has(entry.id) ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  /* ================================================================
   * Academic Periods
   * ================================================================ */

  const addAcademicPeriod = useCallback(
    (item) => {
      setAcademicPeriods((previous) => [
        {
          ...item,
          id: nextId(),
          IsActive: typeof item.IsActive === 'number' ? item.IsActive : 1,
          IsDelete: 0,
          updated: 'Today',
        },
        ...previous,
      ])
      return true
    },
    [nextId],
  )

  const updateAcademicPeriod = useCallback((id, patch) => {
    setAcademicPeriods((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, ...patch, updated: 'Today' } : entry,
      ),
    )
    return true
  }, [])

  const deleteAcademicPeriod = useCallback((id) => {
    setAcademicPeriods((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  const bulkSetAcademicPeriodStatus = useCallback((ids, status) => {
    const set = new Set(ids.map(Number))
    setAcademicPeriods((previous) =>
      previous.map((entry) =>
        set.has(entry.id) && entry.IsDelete === 0
          ? { ...entry, IsActive: status }
          : entry,
      ),
    )
    return true
  }, [])

  const bulkDeleteAcademicPeriods = useCallback((ids) => {
    const set = new Set(ids.map(Number))
    setAcademicPeriods((previous) =>
      previous.map((entry) =>
        set.has(entry.id) ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  /* ================================================================
   * Grade Scales
   * ================================================================ */

  const addGradeScale = useCallback(
    (item) => {
      setGradeScales((previous) => [
        {
          ...item,
          id: nextId(),
          IsActive: typeof item.IsActive === 'number' ? item.IsActive : 1,
          IsDelete: 0,
          updated: 'Today',
        },
        ...previous,
      ])
      return true
    },
    [nextId],
  )

  const updateGradeScale = useCallback((id, patch) => {
    setGradeScales((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, ...patch, updated: 'Today' } : entry,
      ),
    )
    return true
  }, [])

  const deleteGradeScale = useCallback((id) => {
    setGradeScales((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  const bulkSetGradeScaleStatus = useCallback((ids, status) => {
    const set = new Set(ids.map(Number))
    setGradeScales((previous) =>
      previous.map((entry) =>
        set.has(entry.id) && entry.IsDelete === 0
          ? { ...entry, IsActive: status }
          : entry,
      ),
    )
    return true
  }, [])

  const bulkDeleteGradeScales = useCallback((ids) => {
    const set = new Set(ids.map(Number))
    setGradeScales((previous) =>
      previous.map((entry) =>
        set.has(entry.id) ? { ...entry, IsActive: 0, IsDelete: 1 } : entry,
      ),
    )
    return true
  }, [])

  /* ================================================================
   * Teaching Assignments
   * ================================================================ */

  const addAssignment = useCallback(
    (assignment) => {
      setAssignments((previous) => [
        ...previous,
        {
          id: nextId(),
          teacher: assignment.teacher,
          cls: assignment.cls,
          subject: assignment.subject,
          year: assignment.year,
          semester: assignment.semester,
          IsActive: typeof assignment.IsActive === 'number' ? assignment.IsActive : 1,
          IsDelete: 0,
        },
      ])
      return true
    },
    [nextId],
  )

  const updateAssignment = useCallback((id, patch) => {
    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === id ? { ...assignment, ...patch } : assignment,
      ),
    )
    return true
  }, [])

  const deleteAssignment = useCallback((id) => {
    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === id ? { ...assignment, IsActive: 0, IsDelete: 1 } : assignment,
      ),
    )
    return true
  }, [])

  const bulkSetAssignmentStatus = useCallback((ids, status) => {
    const set = new Set(ids.map(Number))
    setAssignments((previous) =>
      previous.map((assignment) =>
        set.has(assignment.id) && assignment.IsDelete === 0
          ? { ...assignment, IsActive: status }
          : assignment,
      ),
    )
    return true
  }, [])

  const bulkDeleteAssignments = useCallback((ids) => {
    const set = new Set(ids.map(Number))
    setAssignments((previous) =>
      previous.map((assignment) =>
        set.has(assignment.id)
          ? { ...assignment, IsActive: 0, IsDelete: 1 }
          : assignment,
      ),
    )
    return true
  }, [])

  /* ================================================================
   * Grade Management (rosters + scores)
   * ================================================================ */

  const generateRoster = useCallback(
    ({ teacher, cls, subject }) => {
      const duplicate = rosters.some(
        (roster) =>
          roster.cls === cls &&
          roster.subject === subject &&
          roster.year === CURRENT_YEAR &&
          roster.IsDelete === 0,
      )
      if (duplicate) return false

      setRosters((previous) => [
        {
          id: nextId(),
          teacher,
          cls,
          subject,
          status: NOT_STARTED,
          year: CURRENT_YEAR,
          semester: CURRENT_SEMESTER,
          IsActive: 1,
          IsDelete: 0,
        },
        ...previous,
      ])
      return true
    },
    [rosters, nextId],
  )

  const deleteRoster = useCallback((id) => {
    setRosters((previous) =>
      previous.map((roster) =>
        roster.id === id ? { ...roster, IsActive: 0, IsDelete: 1 } : roster,
      ),
    )
    setGradeScores((previous) => {
      if (!(id in previous)) return previous
      const next = { ...previous }
      delete next[id]
      return next
    })
    return true
  }, [])

  const bulkSetRosterStatus = useCallback((ids, status) => {
    const set = new Set(ids.map(Number))
    setRosters((previous) =>
      previous.map((roster) =>
        set.has(roster.id) && roster.IsDelete === 0
          ? { ...roster, IsActive: status }
          : roster,
      ),
    )
    return true
  }, [])

  const bulkDeleteRosters = useCallback((ids) => {
    const set = new Set(ids.map(Number))
    setRosters((previous) =>
      previous.map((roster) =>
        set.has(roster.id) ? { ...roster, IsActive: 0, IsDelete: 1 } : roster,
      ),
    )
    setGradeScores((previous) => {
      const next = { ...previous }
      let changed = false
      ids.forEach((id) => {
        if (id in next) {
          delete next[id]
          changed = true
        }
      })
      return changed ? next : previous
    })
    return true
  }, [])

  const saveGradeScores = useCallback((rosterId, scores) => {
    const rows = Object.keys(scores)
    const filled = rows.filter((nis) => isFilledScore(scores[nis]))

    let status
    if (filled.length === 0) status = NOT_STARTED
    else if (filled.length === rows.length) status = COMPLETE
    else status = IN_PROGRESS

    setGradeScores((previous) => ({ ...previous, [rosterId]: { ...scores } }))
    setStudents((previous) =>
      previous.map((student) =>
        isFilledScore(scores[student.nis])
          ? { ...student, avg: Number(scores[student.nis]) }
          : student,
      ),
    )
    setRosters((previous) =>
      previous.map((roster) => (roster.id === rosterId ? { ...roster, status } : roster)),
    )
    return true
  }, [])

  /* ================================================================
   * Context value
   * ================================================================ */

  const value = useMemo(
    () => ({
      /* Data */
      students,
      masterItems,
      assignments,
      rosters,
      gradeScores,
      classes,
      academicPeriods,
      gradeScales,

      /* Derived option sets (integration pass) */
      availableClasses,
      availableSubjects,
      availableYears,
      availableSemesters,

      /* Students */
      nextNis,
      addStudent,
      updateStudent,
      deleteStudent,
      bulkSetStudentStatus,
      bulkDeleteStudents,

      /* Master items */
      addMasterItem,
      updateMasterItem,
      deleteMasterItem,
      bulkSetMasterStatus,
      bulkDeleteMaster,

      /* Classes */
      addClass,
      updateClass,
      deleteClass,
      bulkSetClassStatus,
      bulkDeleteClasses,

      /* Academic periods */
      addAcademicPeriod,
      updateAcademicPeriod,
      deleteAcademicPeriod,
      bulkSetAcademicPeriodStatus,
      bulkDeleteAcademicPeriods,

      /* Grade scales */
      addGradeScale,
      updateGradeScale,
      deleteGradeScale,
      bulkSetGradeScaleStatus,
      bulkDeleteGradeScales,

      /* Teaching assignments */
      addAssignment,
      updateAssignment,
      deleteAssignment,
      bulkSetAssignmentStatus,
      bulkDeleteAssignments,

      /* Grade management */
      generateRoster,
      deleteRoster,
      bulkSetRosterStatus,
      bulkDeleteRosters,
      saveGradeScores,

      /* Helper */
      isVisible,
    }),
    [
      students,
      masterItems,
      assignments,
      rosters,
      gradeScores,
      classes,
      academicPeriods,
      gradeScales,
      availableClasses,
      availableSubjects,
      availableYears,
      availableSemesters,
      nextNis,
      addStudent,
      updateStudent,
      deleteStudent,
      bulkSetStudentStatus,
      bulkDeleteStudents,
      addMasterItem,
      updateMasterItem,
      deleteMasterItem,
      bulkSetMasterStatus,
      bulkDeleteMaster,
      addClass,
      updateClass,
      deleteClass,
      bulkSetClassStatus,
      bulkDeleteClasses,
      addAcademicPeriod,
      updateAcademicPeriod,
      deleteAcademicPeriod,
      bulkSetAcademicPeriodStatus,
      bulkDeleteAcademicPeriods,
      addGradeScale,
      updateGradeScale,
      deleteGradeScale,
      bulkSetGradeScaleStatus,
      bulkDeleteGradeScales,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      bulkSetAssignmentStatus,
      bulkDeleteAssignments,
      generateRoster,
      deleteRoster,
      bulkSetRosterStatus,
      bulkDeleteRosters,
      saveGradeScores,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used inside a DataProvider')
  }
  return context
}