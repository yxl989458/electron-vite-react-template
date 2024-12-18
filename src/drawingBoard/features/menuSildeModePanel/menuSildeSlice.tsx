import { RootState } from '@/drawingBoard/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fabric } from 'fabric'

export type BoundingRect = ReturnType<fabric.Object['getBoundingRect']>

export interface MenuSidePanelState {
  offsetGap: number
  isVisible: boolean
  activeObjectBoundingRect: BoundingRect | null
}

const initialState: MenuSidePanelState = {
  offsetGap: 10,
  isVisible: false,
  activeObjectBoundingRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
}

export const menuSidePanelSlice = createSlice({
  name: 'menuSidePanel',
  initialState,
  reducers: {
    setMenuSidePanelVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload
    },
    setActiveObjectBoundingRect: (state, action: PayloadAction<BoundingRect | null>) => {
      state.activeObjectBoundingRect = action.payload as any
    },
  },
})

export const { setMenuSidePanelVisible, setActiveObjectBoundingRect } = menuSidePanelSlice.actions

export const getMenuSidePanel = (state: RootState) => state.menuSidePanel

export default menuSidePanelSlice.reducer
