import { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
  SvgIcon,
} from '@mui/material'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import HomeIcon from '../assets/icon/home.svg?react'
import SendIcon from '../assets/icon/send.svg?react'
import ExtensionIcon from '../assets/icon/extension.svg?react'
import FreeArtImageIcon from '../assets/icon/freeArtImage.svg?react'
import ModelsIcon from '../assets/icon/models.svg?react'
import WorksIcon from '../assets/icon/works.svg?react'
import ComfyUiIcon from '../assets/icon/comfyUi.svg?react'
import PostsIcon from '../assets/icon/posts.svg?react'

const Logo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '0 8px',
  '& .fast': {
    fontWeight: 500,
  },
  '& .art': {
    color: '#9c27b0',
    fontWeight: 700,
  },
})

const menuItems = [
  {
    text: 'Index',
    icon: <HomeIcon width={24} height={24} />,
    path: '/',
  },
  {
    text: 'AI Apps',
    icon: <SendIcon width={24} height={24} />,
    path: '/ai-apps',
  },
  { text: 'AI Plugins', icon: <ExtensionIcon width={24} height={24} />, path: '/ai-plugins' },
  {
    text: 'Create Image',
    icon: <FreeArtImageIcon width={24} height={24} />,
    path: '/create-image',
  },
  { text: 'Models', icon: <ModelsIcon width={24} height={24} />, path: '/models' },
  { text: 'ComfyUI', icon: <ComfyUiIcon width={24} height={24} />, path: '/comfyui' },
  { text: 'My Works', icon: <WorksIcon width={24} height={24} />, path: '/my-works' },
  { text: 'Posts', icon: <PostsIcon width={24} height={24} />, path: '/posts' },
]

interface SidebarProps {
  drawerWidth: number
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ drawerWidth, isOpen, onToggle }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const drawer = (
    <>
      <Toolbar
        sx={{
          paddingLeft: 0,
        }}>
        <IconButton
          onClick={onToggle}
          sx={{
            padding: 0,
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s',
            mr: isOpen ? 0 : 'auto',
          }}>
          <MenuOpenIcon />
        </IconButton>
        {isOpen && (
          <Logo>
            <Typography variant="h6" component="div" className="fast">
              Fast
            </Typography>
            <Typography variant="h6" component="div" className="art">
              Art
            </Typography>
            <Typography variant="h6" component="div" className="fast">
              .ai
            </Typography>
          </Logo>
        )}
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            component={NavLink}
            to={item.path}
            key={item.text}
            sx={{
              minHeight: 48,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              color: 'text.primary',
              textDecoration: 'none',
              borderRadius: '8px',
              margin: '4px 8px',
              '&.active': {
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover:not(.active)': {
                bgcolor: 'rgba(156, 39, 176, 0.08)',
                borderRadius: '8px',
              },
            }}>
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 3 : 'auto',
                justifyContent: 'center',
                color: 'inherit',
              }}>
              {item.icon}
            </ListItemIcon>
            {isOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </>
  )

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: isOpen ? drawerWidth : 72 },
        flexShrink: { sm: 0 },
        transition: 'width 0.2s',
      }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}>
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isOpen ? drawerWidth : 72,
            transition: 'width 0.2s',
            backgroundColor: 'background.paper',
            overflowX: 'hidden',
          },
          '& .MuiPaper-root': {
            backgroundColor: '#000',
          },
        }}
        open>
        {drawer}
      </Drawer>
    </Box>
  )
}
