import { createListenerMiddleware } from '@reduxjs/toolkit'
import { fabric } from 'fabric'

import initControls from '../core/initControls'
import { initMenuSlide } from '../core/initMenuSlide'
import { setMenuSidePanelVisible } from '../features/menuSideModePanel/menuSildeSlice'
import { strokeColorSelected, strokeSizeSelected } from '../features/optionsPanel/optionsPanelSlice'
import { shapeRemoved, shapesUpdated } from '../features/shapesPanel/shapesPanelSlice'
import { Tool, toolSelected } from '../features/toolsPanel/toolsPanelSlice'
import { ApplyCanvasModeFunc } from './canvas/canvasMode'
import { drawLineMode as applyDrawLineMode } from './canvas/drawLineMode'
import { drawRectMode as applyDrawRectMode } from './canvas/drawRectMode'
import { expandMode as applyExpandMode } from './canvas/expandMode'
import { freeDrawMode as applyFreeDrawMode } from './canvas/freeDrawMode'
import generateSvgForShape from './canvas/generateSvgForShape'
import { handMode as applyHandMode } from './canvas/handMode'
import { darwinPaint as applyInPaintMode } from './canvas/inPaintMode'
import { menuSidePanelMode as applyMenuSidePanelMode } from './canvas/menuSildeMode'
import { moveCanvasMode as applyMoveCanvasMode } from './canvas/moveCanvasMode'
import { textMode as applyTextMode } from './canvas/textboxMode'
import { AppDispatch, RootState } from './store'

// 创建中间件
const _listenerMiddleware = createListenerMiddleware()

// 设置变量
let _cleanupMode = () => {}
export let _canvas: fabric.Canvas

export const initializeCanvasEffect = (canvas: fabric.Canvas, dispatch: AppDispatch) => {
  _canvas = canvas
  initControls(_canvas)
  initMenuSlide(_canvas, dispatch)

  canvas.on('mouse:wheel', (opt) => {
    opt.e.preventDefault()
    if (!opt.e.altKey) return
    const delta = opt.e.deltaY
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 20) zoom = 20
    if (zoom < 0.01) zoom = 0.01

    canvas.zoomToPoint(
      {
        // 关键点
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom,
    )
  })

  _canvas.freeDrawingBrush.width = 1
  document.onkeydown = function (e) {
    switch (e.key) {
      case 'Delete':
        _canvas.getActiveObjects().forEach((x) => dispatch(shapeRemoved(x.name!)))
    }
    canvas.renderAll()
  }
}

_listenerMiddleware.startListening({
  actionCreator: strokeSizeSelected,
  effect: (action) => {
    _canvas.freeDrawingBrush.width = action.payload
  },
})

_listenerMiddleware.startListening({
  actionCreator: strokeColorSelected,
  effect: (action) => {
    _canvas.freeDrawingBrush.color = action.payload
  },
})

_listenerMiddleware.startListening({
  actionCreator: shapeRemoved,
  effect: (action) => {
    const obj = _canvas.getObjects().find((o) => o.name === action.payload)
    if (obj) _canvas.remove(obj)
    _canvas.renderAll()
  },
})

// 监听工具变化
// 当 dispatch 更新时，我们会执行相应操作
_listenerMiddleware.startListening({
  actionCreator: toolSelected,
  effect: (action, listenerApi) => {
    if (!_canvas) return
    if (!action.payload) return

    if (_cleanupMode) _cleanupMode()

    _canvas.off('mouse:up')

    _canvas.on('mouse:up', () => {
      const active = _canvas.getActiveObjects()
      if (active.length) {
        listenerApi.dispatch(shapesUpdated(active.map(generateSvgForShape)))
      }
    })

    const applyMode = canvasMode[action.payload]
    _cleanupMode = applyMode(
      _canvas,
      () => listenerApi.getState() as RootState,
      listenerApi.dispatch as AppDispatch,
    )
  },
})

_listenerMiddleware.startListening({
  actionCreator: setMenuSidePanelVisible,
  effect: (action, listenerApi) => {
    if (action.payload) {
      const applyMode = canvasMode['menu side panel']
      applyMode(
        _canvas,
        () => listenerApi.getState() as RootState,
        listenerApi.dispatch as AppDispatch,
      )
    } else {
      _cleanupMode()
    }
  },
})

const canvasMode: Record<Tool, ApplyCanvasModeFunc<unknown>> = {
  line: applyDrawLineMode,
  move: applyHandMode,
  rectangle: applyDrawRectMode,
  pencil: applyFreeDrawMode,
  'move canvas': applyMoveCanvasMode,
  text: applyTextMode,
  'in paint': applyInPaintMode,
  expand: applyExpandMode,
  'menu side panel': applyMenuSidePanelMode,
}

export default _listenerMiddleware.middleware
