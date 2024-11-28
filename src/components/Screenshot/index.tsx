import { Link } from 'react-router-dom'

export default function Screenshot() {
  function clickCaptrueScreen() {
    window.ipcRenderer.send('capture-screen')
  }
  function clickOpenWin() {
    window.ipcRenderer.invoke('open-win', 'https://www.baidu.com')
  }
  return (
    <div className="flex gap-2">
      <button onClick={clickCaptrueScreen}>captrue Screen</button>
      <button onClick={clickOpenWin}>open win</button>
      <button>
        {' '}
        <Link to="/CanvasWrapperPlan">open CanvasWrapperPlan</Link>
      </button>
    </div>
  )
}
