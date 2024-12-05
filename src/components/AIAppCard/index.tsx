import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export interface AIApp {
  id: number
  title: string
  image: string
  to: string
}

interface AIAppCardProps {
  apps: AIApp[]
}

export const AIAppCard = ({ apps }: AIAppCardProps) => {
  return (
    <Grid container spacing={2}>
      {apps.map((app) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={app.id}>
          <Link to={app.to} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#373737',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}>
              <Box
                component="img"
                src={app.image}
                alt={app.title}
                sx={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                }}
              />
              <Box sx={{ p: 1.5 }}>
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}>
                  {app.title}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}
