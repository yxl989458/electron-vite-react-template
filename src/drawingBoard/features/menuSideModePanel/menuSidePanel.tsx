import { Delete as DeleteIcon } from '@mui/icons-material'
import { MenuItem, MenuList, Paper } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getMenuSidePanel } from './menuSildeSlice'

export default function MenuPanel() {
  const { isVisible, activeObjectBoundingRect } = useSelector(getMenuSidePanel)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  })
  const offsetGap = useSelector(getMenuSidePanel).offsetGap
  useEffect(() => {
    if (menuRef.current && activeObjectBoundingRect) {
      const rect = menuRef.current.getBoundingClientRect()
      if (activeObjectBoundingRect.left - rect.width - offsetGap < 0) {
        setMenuPosition({
          x: activeObjectBoundingRect.left + activeObjectBoundingRect.width + offsetGap,
          y: activeObjectBoundingRect.top,
        })
      } else {
        setMenuPosition({
          x: activeObjectBoundingRect.left - rect.width - offsetGap,
          y: activeObjectBoundingRect.top,
        })
      }
    }
  }, [isVisible, menuRef, activeObjectBoundingRect])

  return (
    <Paper
      ref={menuRef}
      elevation={3}
      style={{
        display: isVisible ? 'block' : 'none',
        transform: `translate(${menuPosition.x}px, ${menuPosition.y}px)`,
      }}
      className="absolute will-change-transform px-2  left-0 top-0 "
      role="menu"
      aria-label="Object menu">
      <MenuList
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        {Array.from({ length: 10 }).map((_, index) => (
          <MenuItem
            dense
            sx={{
              '&.MuiButtonBase-root': {
                padding: '2px',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#9c27b0',
                },
                minHeight: 'auto',
              },
            }}
            focusVisibleClassName="bg-transparent"
            tabIndex={0}>
            <DeleteIcon />
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  )
}
