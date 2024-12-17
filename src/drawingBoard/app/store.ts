import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import toolsPanelReducer from '../features/toolsPanel/toolsPanelSlice'
import canvasMiddleware from './canvasMiddleware'
import optionsPanelReducer from '../features/optionsPanel/optionsPanelSlice'
import shapesPanelReducer from '../features/shapesPanel/shapesPanelSlice'
import controllerPanelReducer from '../features/controllerPanel/controllerPanelSlice'
import menuSlidePanelReducer from '../features/menuSildeModePanel/menuSildeSlice'
export const store = configureStore({
  reducer: {
    menuSidePanel: menuSlidePanelReducer,
    toolsPanel: toolsPanelReducer,
    optionsPanel: optionsPanelReducer,
    shapesPanel: shapesPanelReducer,
    controllerPanel: controllerPanelReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).prepend(canvasMiddleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
