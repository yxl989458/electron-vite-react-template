import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getSelectedTool, toolSelected } from './toolsPanelSlice'

import { showFillOptionsChanged, showStrokeOptionsChanged } from '../optionsPanel/optionsPanelSlice'

import styles from './ToolsPanel.module.css'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import CreateIcon from '@mui/icons-material/Create'
import Crop169Icon from '@mui/icons-material/Crop169'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import OpenWithIcon from '@mui/icons-material/OpenWith'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoveToInboxIcon from '@mui/icons-material/MoveDownSharp'
import ImageIcon from '@mui/icons-material/Image'
import { useRef } from 'react'
import { addImageToCanvas } from '@/drawingBoard/app/canvas/addImage'

export const ToolsPanel = () => {
  const selectedTool = useAppSelector(getSelectedTool)
  const dispatch = useAppDispatch()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    addImageToCanvas(file)
  }

  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Tools</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileSelect}
          />
          <ToggleButtonGroup
            value={selectedTool}
            sx={{ width: '100%' }}
            orientation="vertical"
            exclusive
            onChange={(e, newValue) => {
              dispatch(showFillOptionsChanged(newValue === 'rectangle'))
              dispatch(showStrokeOptionsChanged(newValue !== 'move'))
              dispatch(toolSelected(newValue))
            }}>
            <ToggleButton value="move">
              <div className={styles.toggleButtonContent}>
                Select / Move
                <OpenWithIcon />
              </div>
            </ToggleButton>
            <ToggleButton value="move canvas">
              <div className={styles.toggleButtonContent}>
                move canvas
                <MoveToInboxIcon />
              </div>
            </ToggleButton>
            <ToggleButton value="pencil">
              <div className={styles.toggleButtonContent}>
                Pencil
                <CreateIcon />
              </div>
            </ToggleButton>
            <ToggleButton value="rectangle">
              <div className={styles.toggleButtonContent}>
                Rectangle
                <Crop169Icon />
              </div>
            </ToggleButton>
            <ToggleButton value="line">
              <div className={styles.toggleButtonContent}>
                Line
                <HorizontalRuleIcon sx={{ transform: 'rotate(-45deg)' }} />
              </div>
            </ToggleButton>
            <ToggleButton value="image" onClick={() => fileInputRef.current?.click()}>
              <div className={styles.toggleButtonContent}>
                Upload Image
                <ImageIcon />
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}