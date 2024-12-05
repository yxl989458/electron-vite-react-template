import { createTheme } from '@mui/material'
import { MainLayout } from './layouts/MainLayout'
import { Routes, Route, Outlet } from 'react-router-dom'
import { CanvasWrapper } from './drawingBoard/features/canvas/CanvasWrapper'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1E1E1E',
      paper: '#2A2A2A',
    },
  },
})

function App() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default App
