import { AppBar, Toolbar,IconButton as MuiIconButton, InputBase, Box, Avatar, Menu, MenuItem, Badge, Popover, Typography, Fade, Chip, Tooltip } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import { useState, useCallback } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import RedditIcon from '@mui/icons-material/Reddit'
import NotificationsIcon from '@mui/icons-material/Notifications'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '400px',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))



const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
}))

const FilterChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: '0.75rem',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  '&.MuiChip-filled': {
    backgroundColor: theme.palette.primary.main,
  },
}))

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}))

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.7),
  padding: theme.spacing(1),
  '&:hover': {
    color: theme.palette.common.white,
  },
}))

interface Notification {
  id: number
  type: 'message' | 'success' | 'warning' | 'info'
  title: string
  description: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    title: 'New Message',
    description: 'John Doe sent you a message',
    time: '5 min ago',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Task Completed',
    description: 'Your image has been generated successfully',
    time: '10 min ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Storage Alert',
    description: 'Your storage is almost full',
    time: '1 hour ago',
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'System Update',
    description: 'New version is available',
    time: '2 hours ago',
    read: true
  }
]

const NotificationItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  }
}))

export function Header({ drawerWidth }: { drawerWidth: number }) {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null)
  const [notificationsList, setNotificationsList] = useState(notifications)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  const unreadCount = notificationsList.filter(n => !n.read).length

  const handleMarkAllRead = useCallback(() => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const handleMarkAsRead = useCallback((id: number) => {
    setNotificationsList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])

  const filteredNotifications = notificationsList.filter(notification => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'unread') return !notification.read
    return notification.type === selectedFilter
  })

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageOutlinedIcon color="info" />
      case 'success':
        return <CheckCircleOutlineIcon color="success" />
      case 'warning':
        return <ErrorOutlineIcon color="warning" />
      default:
        return <InfoOutlinedIcon color="primary" />
    }
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'margin-left 0.2s, width 0.2s',
      }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            <SocialButton size="small">
              <TwitterIcon fontSize="small" />
            </SocialButton>
            <SocialButton size="small">
              <YouTubeIcon fontSize="small" />
            </SocialButton>
            <SocialButton size="small">
              <RedditIcon fontSize="small" />
            </SocialButton>
          </Box>

          <IconButton
            size="small"
            onClick={handleNotificationsOpen}
            sx={{
              color: 'text.primary',
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          <UserBox onClick={handleUserMenuOpen}>
            <Box sx={{ 
              display: { xs: 'none', sm: 'block' },
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}>
              nash_su
            </Box>
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt="User Avatar"
              src="/path/to/avatar.jpg"
            />
            <KeyboardArrowDownIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </UserBox>
        </Box>

        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 180,
              backgroundColor: 'background.paper',
            }
          }}
        >
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <PersonOutlineIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <SettingsOutlinedIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>

        <Popover
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={() => setNotificationsAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 4,
            sx: {
              mt: 1.5,
              width: 360,
              maxHeight: 480,
              backgroundColor: 'background.paper',
              overflow: 'hidden',
              borderRadius: 2,
            }
          }}
        >
          <Box>
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">Notifications</Typography>
                {unreadCount > 0 && (
                  <Tooltip title="Mark all as read">
                    <IconButton onClick={handleMarkAllRead} size="small">
                      <DoneAllIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <AccessTimeIcon fontSize="inherit" />
                Updated 2m ago
              </Typography>
            </Box>

            <Box sx={{ 
              p: 1.5, 
              display: 'flex', 
              gap: 1, 
              overflowX: 'auto',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              {['all', 'unread', 'message', 'success', 'warning', 'info'].map((filter) => (
                <FilterChip
                  key={filter}
                  label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                  onClick={() => setSelectedFilter(filter)}
                  variant={selectedFilter === filter ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>

            <Box 
              sx={{ 
                maxHeight: 400, 
                overflow: 'auto',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                  pointerEvents: 'none',
                }
              }}
            >
              {filteredNotifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="body2">No notifications found</Typography>
                </Box>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    {getNotificationIcon(notification.type)}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: notification.read ? 400 : 600,
                          color: notification.read ? 'text.secondary' : 'text.primary'
                        }}>
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                          {notification.time}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {notification.description}
                      </Typography>
                    </Box>
                  </NotificationItem>
                ))
              )}
            </Box>

            <Box sx={{ 
              p: 1.5, 
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Typography 
                variant="button" 
                sx={{ 
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                View All Notifications
              </Typography>
            </Box>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  )
} 