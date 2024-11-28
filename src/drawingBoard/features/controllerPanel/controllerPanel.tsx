import { useSelector } from 'react-redux'
import { getControllerPanel } from './controllerPanelSlice'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import DraftsIcon from '@mui/icons-material/Drafts'
import AbcIcon from '@mui/icons-material/Abc'
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import { _canvas } from '@/drawingBoard/app/canvasMiddleware'
import { useEffect } from 'react'

export const ControllerPanel = () => {
  const {
    show,
    position: [x, y],
  } = useSelector(getControllerPanel)

  return (
    <>
      {show && (
        <nav
          style={{ transform: `translate(${x}px, ${y}px)` }}
          className="absolute flex  flex-col gap-3 bg-gray-400 justify-center items-center p-2 rounded-md top-0 left-0">
          <InboxIcon />
          <DraftsIcon />
          <AbcIcon />
          <AccessAlarmRoundedIcon />
          <FormatAlignLeftIcon />
          <FormatAlignCenterIcon />
          <FormatAlignRightIcon />
          <FormatAlignJustifyIcon />
        </nav>
      )}
    </>
  )
}
