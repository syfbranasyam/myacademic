/*
 * Client-side pagination (spec §7.7, §10.5). Six rows per page everywhere the
 * prototype paginates.
 */

/**
 * Slices the rows for the requested page and clamps the page number.
 * @param {Array} items full filtered list
 * @param {number} page 1-based
 * @param {number} perPage rows per page
 * @returns {{ rows: Array, totalPages: number, currentPage: number, from: number, to: number }}
 */
export function paginate(items, page, perPage) {
  const list = Array.isArray(items) ? items : []
  const size = perPage > 0 ? perPage : 1
  const totalPages = Math.max(1, Math.ceil(list.length / size))
  const currentPage = Math.min(Math.max(1, page || 1), totalPages)
  const start = (currentPage - 1) * size

  return {
    rows: list.slice(start, start + size),
    totalPages,
    currentPage,
    from: list.length ? start + 1 : 0,
    to: Math.min(start + size, list.length),
  }
}

/**
 * The page numbers to display (spec §7.7).
 *
 * Fewer than six pages shows them all. Six or more shows the first three, the
 * current page and the last page; the caller inserts an ellipsis wherever
 * numbers are skipped.
 */
export function pageNumbers(current, total) {
  const totalPages = Math.max(1, total)
  const currentPage = Math.min(Math.max(1, current), totalPages)

  return Array.from({ length: totalPages }, (unused, index) => index + 1).filter(
    (page) =>
      totalPages < 6 || page < 4 || page === totalPages || Math.abs(page - currentPage) < 1,
  )
}