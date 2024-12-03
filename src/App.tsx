import { MainLayout } from './layouts/MainLayout'
import { Routes, Route, Outlet } from 'react-router-dom'
import { CanvasWrapper } from './drawingBoard/features/canvas/CanvasWrapper'

function App() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default App
