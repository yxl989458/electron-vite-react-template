import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getSelectedTool, toolSelected } from './toolsPanelSlice'

import { showFillOptionsChanged, showStrokeOptionsChanged } from '../optionsPanel/optionsPanelSlice'

import styles from './ToolsPanel.module.css'

import { addImageToCanvas } from '@/drawingBoard/app/canvas/addImage'
import { Pentagon as SendSharpIcon } from '@mui/icons-material'
import CreateIcon from '@mui/icons-material/Create'
import Crop169Icon from '@mui/icons-material/Crop169'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import ImageIcon from '@mui/icons-material/Image'
import MoveToInboxIcon from '@mui/icons-material/MoveDownSharp'
import OpenWithIcon from '@mui/icons-material/OpenWith'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { useRef } from 'react'

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
            <ToggleButton value="text">
              <div className={styles.toggleButtonContent}>
                Text
                <TextFieldsIcon />
              </div>
            </ToggleButton>
            <ToggleButton value="in paint">
              <div className={styles.toggleButtonContent}>
                in paint
                <SendSharpIcon />
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
