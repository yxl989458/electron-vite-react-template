import { Stack, Typography, Box, styled } from '@mui/material'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

interface FeatureCardProps {
  icon: React.FC
  title: string
  to: string
  padding?: string | number
  boxClassName?: string
}

export const FeatureCard = ({
  icon: Icon,
  title,
  to,
  boxClassName,
}: FeatureCardProps) => (
  <Stack sx={{ backgroundColor: '#1e1e20' }}>
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Box className={clsx('flex items-center gap-2 bg-[#373737] rounded-lg', boxClassName)}>
        <Icon />
        <Typography
          color="white"
          sx={{
            fontWeight: 400,
            fontSize: '16px',
          }}>
          {title}
        </Typography>
      </Box>
    </Link>
  </Stack>
)
