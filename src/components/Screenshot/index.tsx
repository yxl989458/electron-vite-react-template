export default function Screenshot() {
  function clickCaptrueScreen() {
    window.ipcRenderer.send('capture-screen')
  }
  function clickOpenWin() {
    window.ipcRenderer.invoke('open-win', 'https://www.baidu.com')
  }
  return (
    <>
      <button onClick={clickCaptrueScreen}>captrue Screen</button>
      <button onClick={clickOpenWin}>open win</button>
    </>
  )
}
