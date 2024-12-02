import { createListenerMiddleware } from '@reduxjs/toolkit'
import { fabric } from 'fabric'

import { drawLineMode as applyDrawLineMode } from './canvas/drawLineMode'
import { drawRectMode as applyDrawRectMode } from './canvas/drawRectMode'
import { freeDrawMode as applyFreeDrawMode } from './canvas/freeDrawMode'
import generateSvgForShape from './canvas/generateSvgForShape'
import { handMode as applyHandMode } from './canvas/handMode'
import { darwinPaint as applyInPaintMode } from './canvas/inPaintMode'
import { moveCanvasMode as applyMoveCanvasMode } from './canvas/moveCanvasMode'
import { textMode as applyTextMode } from './canvas/textboxMode'
import { AppDispatch, RootState } from './store'

import { strokeColorSelected, strokeSizeSelected } from '../features/optionsPanel/optionsPanelSlice'
import { shapeRemoved, shapesUpdated } from '../features/shapesPanel/shapesPanelSlice'
import { Tool, toolSelected } from '../features/toolsPanel/toolsPanelSlice'
import { ApplyCanvasModeFunc } from './canvas/canvasMode'

// 创建中间件
const _listenerMiddleware = createListenerMiddleware()

// 设置变量
let _cleanupMode = () => {}
export let _canvas: fabric.Canvas

export const initializeCanvasEffect = (canvas: fabric.Canvas, dispatch: AppDispatch) => {
  _canvas = canvas
  _canvas.freeDrawingBrush.width = 1
  document.onkeydown = function (e) {
    switch (e.key) {
      case 'Delete':
        // 当按下删除键时，我们会为每个选中的对象触发删除事件
        _canvas.getActiveObjects().forEach((x) => dispatch(shapeRemoved(x.name!)))
    }
    canvas.renderAll()
  }
}

// 每当 strokeSizeSelected action 被触发时
// 我们会在 _canvas 对象中更新该设置
_listenerMiddleware.startListening({
  actionCreator: strokeSizeSelected,
  effect: (action) => {
    _canvas.freeDrawingBrush.width = action.payload
  },
})

// 同上
_listenerMiddleware.startListening({
  actionCreator: strokeColorSelected,
  effect: (action) => {
    _canvas.freeDrawingBrush.color = action.payload
  },
})

// 监听形状移除事件
// 可以从形状面板触发或通过按删除键触发
// 我们会找到提到的对象并从画布中移除它
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

    // 在工具变化时取消订阅特定工具添加的画布事件
    if (_cleanupMode) _cleanupMode()

    // 工具可能已关闭或未关闭 mouse:up，让我们取消订阅以确保安全
    _canvas.off('mouse:up')

    // 重新订阅因为我们需要它
    _canvas.on('mouse:up', () => {
      // 这将在绘制或移动事件结束时发生
      const active = _canvas.getActiveObjects()
      if (active.length) {
        // 分发所有更新的对象以在形状面板上显示变化
        // 形状面板在画布上的相应位置分别显示每个形状
        listenerApi.dispatch(shapesUpdated(active.map(generateSvgForShape)))
      }
    })

    // 通过工具检测模式
    const applyMode = canvasMode[action.payload]
    // 应用检测到的模式并保存其清理函数
    _cleanupMode = applyMode(
      _canvas,
      () => listenerApi.getState() as RootState,
      listenerApi.dispatch as AppDispatch
    )
  },
})

// 工具到应用模式函数的映射
const canvasMode: Record<Tool, ApplyCanvasModeFunc<unknown>> = {
  line: applyDrawLineMode,
  move: applyHandMode,
  rectangle: applyDrawRectMode,
  pencil: applyFreeDrawMode,
  'move canvas': applyMoveCanvasMode,
  text: applyTextMode,
  'in paint': applyInPaintMode,
}

export default _listenerMiddleware.middleware
