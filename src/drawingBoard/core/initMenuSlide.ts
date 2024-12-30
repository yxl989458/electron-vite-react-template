import { AppDispatch } from '../app/store'
import {
  setActiveObjectBoundingRect,
  setMenuSidePanelVisible,
} from '../features/menuSideModePanel/menuSildeSlice'

export const initMenuSlide = (canvas: fabric.Canvas, dispatch: AppDispatch) => {
  canvas.on('selection:created', (options) => {
    if (options.selected && !options.selected.length) return
    dispatch(setMenuSidePanelVisible(true))
    dispatch(setActiveObjectBoundingRect(options.selected![0].getBoundingRect()))
  })
  canvas.on('selection:updated', (options) => {
    dispatch(setActiveObjectBoundingRect(options.selected![0].getBoundingRect()))
  })

  canvas.on('selection:cleared', (options) => {
    console.log('selection:cleared', options)
    dispatch(setMenuSidePanelVisible(false))
  })
}
