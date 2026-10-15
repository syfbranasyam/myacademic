import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/theme.css'

import App from './App'

/*
 * Bootstrap is no longer imported — all components are on MUI. theme.css now
 * contains only the two design tokens still referenced by inline var(--...)
 * declarations in migrated components, plus .num and .mono utility classes.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)