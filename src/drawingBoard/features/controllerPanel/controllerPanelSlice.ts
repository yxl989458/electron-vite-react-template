import { RootState } from '@/drawingBoard/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ControllerPanelState {
  show: boolean
  position: [number, number]
}

const initialState: ControllerPanelState = {
  show: false,
  position: [0, 0],
}

export const controllerPanelSlice = createSlice({
  name: 'controllerPanel',
  initialState,
  reducers: {
    showControllerPanel: (state) => {
      state.show = true
    },
    hideControllerPanel: (state) => {
      state.show = false
    },
    setControllerPanelPosition: (state, action: PayloadAction<[number, number]>) => {
      state.position = action.payload
    },
  },
})

export const { showControllerPanel, hideControllerPanel, setControllerPanelPosition } =
  controllerPanelSlice.actions

export const getControllerPanel = (state: RootState) => state.controllerPanel

export default controllerPanelSlice.reducer
