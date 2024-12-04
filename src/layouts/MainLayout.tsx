import { Box } from '@mui/material'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useState } from 'react'
const drawerWidth = 240

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Box sx={{ display: 'flex', fontWeight: 700 }}>
      <Header drawerWidth={isSidebarOpen ? drawerWidth : 72} />
      <Sidebar 
        drawerWidth={drawerWidth} 
        isOpen={isSidebarOpen} 
        onToggle={handleSidebarToggle} 
      />
      <Box
        component="main"
        sx={{
          padding: 3,
          paddingTop:10,
          flexGrow: 1,
          bgcolor: '#1e1e20',
          minHeight: '100vh',
          transition: 'margin-left 0.2s, width 0.2s',
        }}>
        {children}
      </Box>
    </Box>
  )
} 