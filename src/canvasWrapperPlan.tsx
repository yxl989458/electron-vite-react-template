import { CanvasWrapper } from './drawingBoard/features/canvas/CanvasWrapper'
import { OptionsPanel } from './drawingBoard/features/optionsPanel/OptionsPanel'
import { ShapesPanel } from './drawingBoard/features/shapesPanel/ShapesPanel'
import { ToolsPanel } from './drawingBoard/features/toolsPanel/ToolsPanel'

function CanvasWrapperPlan() {
  return (
    <div className="flex  overflow-auto ">
      <div className="Sidebar w-[280px] flex-shrink-0 bg-#dcdcdc">
        <ToolsPanel />
        <OptionsPanel />
        <ShapesPanel />
      </div>
      <CanvasWrapper />
    </div>
  )
}

export default CanvasWrapperPlan
