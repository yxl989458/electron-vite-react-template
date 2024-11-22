import { HashRouter, Route, Routes } from 'react-router-dom'
import Capture from './capture'
import Screenshot from './components/Screenshot'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Screenshot></Screenshot>} />
        <Route path="/capture" element={<Capture />} />
      </Routes>
    </HashRouter>
  )
}

export default App
