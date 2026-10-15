import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'

import { muiTheme } from './styles/muiTheme'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './routes/AppRoutes'

/*
 * Provider nesting (AGENTS.md): ToastProvider outermost, then AuthProvider,
 * then DataProvider.
 *
 * ThemeProvider wraps everything so any MUI component rendered anywhere in the
 * tree inherits the My Academic theme. CssBaseline is intentionally NOT added
 * during 2a–2f: it aggressively resets margins and would fight Bootstrap CSS,
 * which is still loaded. CssBaseline is added at sub-phase 2g in the same
 * commit that removes Bootstrap.
 */
export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}