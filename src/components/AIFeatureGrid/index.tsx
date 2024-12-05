import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export interface AIFeature {
  id: number
  title: string
  image: string
  to: string
}

interface AIFeatureGridProps {
  features: AIFeature[]
}

export const AIFeatureGrid = ({ features }: AIFeatureGridProps) => {
  return (
    <Grid container spacing={2}>
      {features.map((feature) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={feature.id}>
          <Link to={feature.to} style={{ textDecoration: 'none' }}>
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
                src={feature.image}
                alt={feature.title}
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
                  {feature.title}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}
