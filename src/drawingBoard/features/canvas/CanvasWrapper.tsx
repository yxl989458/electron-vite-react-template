import { fabric } from 'fabric'
import { useEffect, useRef } from 'react'
import { initializeCanvasEffect } from '../../app/canvasMiddleware'
import { useAppDispatch } from '../../app/hooks'
import { ControllerPanel } from '../controllerPanel/controllerPanel'
export const CanvasWrapper = () => {
  const canvasEl = useRef(null)
  const containerEl = useRef(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, { selection: false, stopContextMenu: true })

    //The only direct interaction. Required to pass canvas object to the middleware
    initializeCanvasEffect(canvas, dispatch)
    return () => {
      canvas.dispose()
      console.log('Canvas Disposed')
    }
  }, []) //if this effects will get called again, you'll loose all objects present on canvas

  return (
    <div ref={containerEl} className="border w-full relative">
      <canvas
        width={1350}
        height={900}
        ref={canvasEl}
        className="bg-gray-400/20 border absolute inset-0 border-blue-500"
      />
      <ControllerPanel />
    </div>
  )
}
