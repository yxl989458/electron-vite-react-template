import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

export interface InPaintState {
  path: string
  points: fabric.Point[]
}

const initialState: InPaintState = {
  path: '',
  points: [],
}

export const inPaintSlice = createSlice({
  name: 'inPaint',
  initialState,
  reducers: {
    setPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload
    },
    setPoints: (state, action: PayloadAction<fabric.Point[]>) => {
      state.points = action.payload
    },
  },
})

export const { setPath, setPoints } = inPaintSlice.actions

export const getPath = (state: RootState) => state.inPaint.path
export const inPaintReducer = inPaintSlice.reducer
