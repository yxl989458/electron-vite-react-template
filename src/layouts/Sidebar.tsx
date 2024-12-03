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
  Divider
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AppsIcon from '@mui/icons-material/Apps'
import ExtensionIcon from '@mui/icons-material/Extension'
import ImageIcon from '@mui/icons-material/Image'
import CategoryIcon from '@mui/icons-material/Category'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import WorkIcon from '@mui/icons-material/Work'
import ArticleIcon from '@mui/icons-material/Article'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

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
  }
})

const menuItems = [
  { text: 'Index', icon: <HomeIcon />, path: '/' },
  { text: 'AI Apps', icon: <AppsIcon />, path: '/ai-apps' },
  { text: 'AI Plugins', icon: <ExtensionIcon />, path: '/ai-plugins' },
  { text: 'Create Image', icon: <ImageIcon />, path: '/create-image' },
  { text: 'Models', icon: <CategoryIcon />, path: '/models' },
  { text: 'ComfyUI', icon: <DesignServicesIcon />, path: '/comfyui' },
  { text: 'My Works', icon: <WorkIcon />, path: '/my-works' },
  { text: 'Posts', icon: <ArticleIcon />, path: '/posts' },
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
        }}
      >
        <IconButton 
          onClick={onToggle}
          sx={{
            padding: 0,
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s',
            mr: isOpen ? 0 : 'auto',
          }}
        >
          <MenuOpenIcon />
        </IconButton>
        {isOpen && (
          <Logo >
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
              '&.active': {
                bgcolor: 'action.selected',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
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
      }}
    >
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
        }}
        open>
        {drawer}
      </Drawer>
    </Box>
  )
} 