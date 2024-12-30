import { fabric } from 'fabric'
import { useEffect, useRef } from 'react'
import { initializeCanvasEffect } from '../../app/canvasMiddleware'
import { useAppDispatch } from '../../app/hooks'
import { ControllerPanel } from '../controllerPanel/controllerPanel'
import MenuPanel from '../menuSideModePanel/menuSidePanel'
export const CanvasWrapper = () => {
  const canvasEl = useRef(null)
  const containerEl = useRef(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, { selection: false, stopContextMenu: true })

    initializeCanvasEffect(canvas, dispatch)

    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <div ref={containerEl} className="border  w-full relative">
      <canvas
        width={1340}
        height={850}
        ref={canvasEl}
        className="bg-gray-400/20 border rounded-md absolute inset-0 border-blue-500"
      />
      <ControllerPanel />
      <MenuPanel />
    </div>
  )
}
