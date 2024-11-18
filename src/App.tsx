import UpdateElectron from '@/components/update'

import { useState } from 'react'
import './App.css'
import logoElectron from './assets/logo-electron.svg'
import logoVite from './assets/logo-vite.svg'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <div className="logo-box">
        <a
          href="https://github.com/electron-vite/electron-vite-react"
          target="_blank">
          <img
            src={logoVite}
            className="logo vite"
            alt="Electron + Vite logo"
          />
          <img
            src={logoElectron}
            className="logo electron"
            alt="Electron + Vite logo"
          />
        </a>
      </div>
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
        Electron + Vite + React
      </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is <span className="text-red-500">{count}</span>
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Electron + Vite logo to learn more
      </p>
      <div className="flex-center">
        Place static files into the<code>/public</code> folder{' '}
        <img style={{ width: '5em' }} src="./node.svg" alt="Node logo" />
      </div>
      <UpdateElectron />
    </div>
  )
}

export default App
