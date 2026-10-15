import Grid from '@mui/material/Grid2'
import { StatCard } from '../ui'

/*
 * Four KPI cards for the Academic Result directory (spec §5.3, §10.7).
 *
 * All figures are computed from the full student list — filters on the page do
 * NOT affect these cards (spec §13.1 item 13 preserves that rule).
 *
 *   - Total Students Assessed   "N / N Enrolled"
 *   - Ledger Mean Score         mean of all averages, 1 decimal
 *   - Passing Rate              percentage + "N Pass"
 *   - Remedial Flagged          count + "Requires Follow-up", red styling
 *
 * The red styling on Remedial Flagged uses StatCard's `tone="red"` variant.
 */
export default function ResultKpiCards({ students }) {
  const total = students.length
  const mean = total ? students.reduce((sum, s) => sum + s.avg, 0) / total : 0
  const passing = students.filter((s) => s.avg >= 75).length
  const remedial = total - passing
  const passRate = total ? (passing / total) * 100 : 0

  return (
    <Grid container spacing={2} sx={{ mb: 2.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          layout="horizontal"
          label="Total Students Assessed"
          value={total}
          detail={`/ ${total} Enrolled`}
          icon="groups"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          layout="horizontal"
          label="Ledger Mean Score"
          value={mean.toFixed(1)}
          icon="trending_up"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          layout="horizontal"
          label="Passing Rate"
          value={`${passRate.toFixed(1)}%`}
          detail={`${passing} Pass`}
          icon="verified"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          layout="horizontal"
          tone="red"
          label="Remedial Flagged"
          value={remedial}
          detail="Requires Follow-up"
          icon="warning"
        />
      </Grid>
    </Grid>
  )
}