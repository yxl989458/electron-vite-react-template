import { Box, Typography, Grid, styled, Stack, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import { Brush as BrushIcon } from '@mui/icons-material'
import { FeatureCard } from '@/components/FeatureCard'
import Imagele from '@/assets/icon/Imagle.svg?react'
import VideoIcon from '@/assets/icon/video.svg?react'
import PhotoShopIcon from '@/assets/icon/photoShop.svg?react'
import SketchupIcon from '@/assets/icon/sketchup.svg?react'
import KritaIcon from '@/assets/icon/krita.svg?react'
import BlenderIcon from '@/assets/icon/Blender.svg?react'
import FrameIcon from '@/assets/icon/Frame-1.svg?react'
const SectionTitle = styled(Typography)({
  marginBottom: '16px',
})


const HomePage = () => {
  return (
    <Stack spacing={4} >
    <Stack spacing={4} direction={{md: 'column', xl: 'row'}}>
      <Box>
        <SectionTitle sx={{color: '#fff', fontSize: '24px'}}>Create Arts</SectionTitle>
        <Stack direction="row" spacing={1}>
          <FeatureCard boxClassName='p-3' icon={Imagele} title="AI Generate / Edit Image" to="/create-image" />
          <FeatureCard boxClassName='p-3' icon={VideoIcon} title="Text/Image to Video" to="/text-to-video" />
        </Stack>
      </Box>
      <Box>
        <SectionTitle  sx={{color: '#fff', fontSize: '24px'}}>AI Plugins</SectionTitle>
        <Stack direction="row" spacing={1}>
          <FeatureCard boxClassName='p-3' icon={PhotoShopIcon} title="Photoshop Plugin" to="/photoshop-plugin" />
          <FeatureCard boxClassName='p-3' icon={SketchupIcon} title="Sketchup Plugin" to="/sketchup-plugin" />
          <FeatureCard boxClassName='p-3' icon={KritaIcon} title="Krita Plugin" to="/krita-plugin" />
          <FeatureCard boxClassName='p-3' icon={BlenderIcon} title="Blender Plugin" to="/blender-plugin" />
        </Stack>
      </Box>
      </Stack >
      <Box>
        <SectionTitle>AI Widgets</SectionTitle>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <FeatureCard 
            icon={FrameIcon} 
            title="Background Removal" 
            to="/background-removal"
            boxClassName='py-2 px-4'
          />
          <FeatureCard 
            icon={FrameIcon} 
            title="Enlarge Image" 
            boxClassName='py-2 px-4'
            to="/enlarge-image"
          />
          <FeatureCard 
            icon={FrameIcon} 
            title="Enhance Color" 
            boxClassName='py-2 px-4'
            to="/enhance-color"
            padding="2"
          />
          <FeatureCard 
            icon={FrameIcon} 
            title="Expand Image" 
            boxClassName='py-2 px-4'
            to="/expand-image"
            padding="2"
          />
          <FeatureCard 
            icon={FrameIcon} 
            title="Inpainting" 
            boxClassName='py-2 px-4'
            to="/inpainting"
            padding="2"
          />
          <FeatureCard 
            icon={FrameIcon} 
            boxClassName='py-2 px-4'
            title="Object Replace" 
            to="/object-replace"
            padding="2"
          />
        </Stack>
      </Box>
    </Stack>
  )
}

export default HomePage
