import { useEventListener } from '@/hooks/useEventListener'
import { useCallback, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

interface SelectionArea extends Position, Size {}

export default function Capture() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [selectionArea, setSelectionArea] = useState<SelectionArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON') return

    setIsSelecting(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setSelectionArea({
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
    })
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return

      const width = e.clientX - startPos.x
      const height = e.clientY - startPos.y

      setSelectionArea({
        x: width > 0 ? startPos.x : e.clientX,
        y: height > 0 ? startPos.y : e.clientY,
        width: Math.abs(width),
        height: Math.abs(height),
      })
    },
    [isSelecting, startPos]
  )

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false)
    if (selectionArea.width > 0 && selectionArea.height > 0) {
      window.ipcRenderer.send('capture-screen-enabled')
    }
  }, [selectionArea])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      window.ipcRenderer.send('close-capture-win')
    }
  }, [])

  const handleConfirm = useCallback(() => {
    console.log('capture-screen-result')

    window.ipcRenderer.send('capture-screen-result', selectionArea)
  }, [selectionArea])

  const handleCancel = useCallback(() => {
    window.ipcRenderer.send('close-capture-win')
  }, [])

  useEventListener('mousedown', handleMouseDown)
  useEventListener('mousemove', handleMouseMove)
  useEventListener('mouseup', handleMouseUp)
  useEventListener('keydown', handleKeyDown)

  window.ipcRenderer.on('capture-screen-complete', (event, data) => {
    console.log('capture-screen-complete', data)
    // 粘贴到剪贴板
  })
  //TODO: 获取截图窗口id 目前没有用
  window.ipcRenderer.on('on-capture-screen-id', (event, id) => {
    console.log(id)
  })

  return (
    <div ref={overlayRef} className="fixed inset-0">
      {/* 四个遮罩层，不覆盖选区 */}
      <div
        className="absolute bg-black/50 inset-0"
        style={{
          clipPath:
            selectionArea.width > 0
              ? `polygon(
                0 0, 
                100% 0, 
                100% 100%, 
                0 100%, 
                0 0, 
                ${selectionArea.x}px ${selectionArea.y}px, 
                ${selectionArea.x}px ${selectionArea.y + selectionArea.height}px, 
                ${selectionArea.x + selectionArea.width}px ${
                  selectionArea.y + selectionArea.height
                }px, 
                ${selectionArea.x + selectionArea.width}px ${selectionArea.y}px, 
                ${selectionArea.x}px ${selectionArea.y}px
              )`
              : 'none',
        }}
      />

      {selectionArea.width > 0 && selectionArea.height > 0 && (
        <div
          className="absolute border-2 border-blue-500 pointer-events-none"
          style={{
            left: `${selectionArea.x}px`,
            top: `${selectionArea.y}px`,
            width: `${selectionArea.width}px`,
            height: `${selectionArea.height}px`,
          }}>
          <div className="absolute -top-6 left-0 bg-white px-2 py-1 text-xs text-gray-800">
            {selectionArea.width} x {selectionArea.height}
          </div>
        </div>
      )}

      {selectionArea.width > 0 && selectionArea.height > 0 && !isSelecting && (
        <div
          className="absolute flex gap-2 bg-white px-2 py-1 rounded shadow-lg z-50"
          style={{
            left: `${selectionArea.x + selectionArea.width - 100}px`,
            top: `${selectionArea.y + selectionArea.height + 10}px`,
          }}>
          <button
            type="button"
            onClick={handleCancel}
            className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer">
            确定
          </button>
        </div>
      )}
    </div>
  )
}
