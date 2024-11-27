import { HashRouter, Route, Routes } from 'react-router-dom'
import Capture from './capture'
import Screenshot from './components/Screenshot'
import CanvasWrapperPlan from './canvasWrapperPlan'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Screenshot></Screenshot>} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/canvasWrapperPlan" element={<CanvasWrapperPlan />} />
      </Routes>
    </HashRouter>
  )
}

export default App
