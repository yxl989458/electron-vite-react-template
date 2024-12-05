import { Grid, Paper, Typography, Box } from '@mui/material'
import PhotoshopIcon from '@mui/icons-material/PhotoCamera'
import SketchupIcon from '@mui/icons-material/Architecture'
import KritaIcon from '@mui/icons-material/Brush'
import BlenderIcon from '@mui/icons-material/ThreeDRotation'

const plugins = [
  { name: 'Photoshop Plugin', icon: <PhotoshopIcon /> },
  { name: 'Sketchup Plugin', icon: <SketchupIcon /> },
  { name: 'Krita Plugin', icon: <KritaIcon /> },
  { name: 'Blender Plugin', icon: <BlenderIcon /> },
]

export function AIPlugins() {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {plugins.map((plugin) => (
        <Grid item xs={12} sm={6} md={3} key={plugin.name}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}>
            <Box
              sx={{
                fontSize: 40,
                mb: 1,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {plugin.icon}
            </Box>
            <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
              {plugin.name}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
