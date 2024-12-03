import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'

interface AICardProps {
  title: string
  image: string
  type: string
  beforeImage?: string
  afterImage?: string
}

export function AICard({ title, image, type, beforeImage, afterImage }: AICardProps) {
  return (
    <Card sx={{ maxWidth: 345, bgcolor: 'background.paper' }}>
      {type === 'comparison' && beforeImage && afterImage ? (
        <Box sx={{ position: 'relative', paddingTop: '100%' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              overflow: 'hidden',
            }}>
            <CardMedia component="img" image={beforeImage} alt="Before" sx={{ height: '100%' }} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              overflow: 'hidden',
            }}>
            <CardMedia component="img" image={afterImage} alt="After" sx={{ height: '100%' }} />
          </Box>
        </Box>
      ) : (
        <CardMedia component="img" height="200" image={image} alt={title} />
      )}
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
} 