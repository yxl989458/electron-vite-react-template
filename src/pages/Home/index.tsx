import backgroundRemovalIcon from '@/assets/icon/backgroundRemoval.svg?react'
import BlenderIcon from '@/assets/icon/Blender.svg?react'
import enhanceColorIcon from '@/assets/icon/enhanceColor.svg?react'
import enlargeImageIcon from '@/assets/icon/enlargeImage.svg?react'
import expandImage from '@/assets/icon/expandImage.svg?react'
import Imagele from '@/assets/icon/Imagle.svg?react'
import inPainTingIcon from '@/assets/icon/inPainTing.svg?react'
import KritaIcon from '@/assets/icon/krita.svg?react'
import MoreHorizIcon from '@/assets/icon/moreHoriz.svg?react'
import objectReplaceIcon from '@/assets/icon/objectReplace.svg?react'
import PhotoShopIcon from '@/assets/icon/photoShop.svg?react'
import SketchupIcon from '@/assets/icon/sketchup.svg?react'
import VideoIcon from '@/assets/icon/video.svg?react'
import { AIAppCard } from '@/components/AIAppCard'
import { FeatureCard } from '@/components/FeatureCard'
import { TagNav } from '@/components/TagNav'
import Title from '@/components/Title'
import { aiApps } from '@/data/aiApps'
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const tags = [
  { label: 'all', value: 'all' },
  { label: 'animate', value: 'animate' },
  { label: 'sci-fi', value: 'sci-fi' },
  { label: 'photo', value: 'photo' },
  { label: 'landscape', value: 'landscape' },
  { label: 'art font', value: 'art-font' },
  { label: 'realistic', value: 'realistic' },
  { label: 'game', value: 'game' },
  { label: 'portrait', value: 'portrait' },
  { label: 'genshin', value: 'genshin' },
  { label: 'comic', value: 'comic' },
  { label: 'cartoon', value: 'cartoon' },
  { label: 'cyberpunk', value: 'cyberpunk' },
  { label: 'mecha', value: 'mecha' },
  { label: 'food', value: 'food' },
  { label: 'man', value: 'man' },
]

const HomePage = () => {
  const handleTagChange = (value: string) => {
    // 处理标签切换逻辑
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={4} direction={{ md: 'column', xl: 'row' }}>
        <Box>
          <Typography sx={{ color: '#fff', fontSize: '24px', mb: 2 }}>Create Arts</Typography>
          <Stack direction="row" spacing={1}>
            <FeatureCard
              boxClassName="p-3"
              icon={Imagele}
              title="AI Generate / Edit Image"
              to="/create-image"
            />
            <FeatureCard
              boxClassName="p-3"
              icon={VideoIcon}
              title="Text/Image to Video"
              to="/text-to-video"
            />
          </Stack>
        </Box>
        <Box>
          <Typography sx={{ color: '#fff', fontSize: '24px', mb: 2 }}>AI Plugins</Typography>
          <Stack direction="row" spacing={1}>
            <FeatureCard
              boxClassName="p-3"
              icon={PhotoShopIcon}
              title="Photoshop Plugin"
              to="/photoshop-plugin"
            />
            <FeatureCard
              boxClassName="p-3"
              icon={SketchupIcon}
              title="Sketchup Plugin"
              to="/sketchup-plugin"
            />
            <FeatureCard
              boxClassName="p-3"
              icon={KritaIcon}
              title="Krita Plugin"
              to="/krita-plugin"
            />
            <FeatureCard
              boxClassName="p-3"
              icon={BlenderIcon}
              title="Blender Plugin"
              to="/blender-plugin"
            />
          </Stack>
        </Box>
      </Stack>
      <Box>
        <Typography sx={{ color: '#fff', fontSize: '24px', mb: 2 }}>AI Widgets</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <FeatureCard
            icon={backgroundRemovalIcon}
            title="Background Removal"
            to="/background-removal"
            boxClassName="py-2 px-4"
          />
          <FeatureCard
            icon={enlargeImageIcon}
            title="Enlarge Image"
            boxClassName="py-2 px-4"
            to="/enlarge-image"
          />
          <FeatureCard
            icon={enhanceColorIcon}
            title="Enhance Color"
            boxClassName="py-2 px-4"
            to="/enhance-color"
            padding="2"
          />
          <FeatureCard
            icon={expandImage}
            title="Expand Image"
            boxClassName="py-2 px-4"
            to="/expand-image"
            padding="2"
          />
          <FeatureCard
            icon={inPainTingIcon}
            title="Inpainting"
            boxClassName="py-2 px-4"
            to="/inpainting"
            padding="2"
          />
          <FeatureCard
            icon={objectReplaceIcon}
            boxClassName="py-2 px-4"
            title="Object Replace"
            to="/object-replace"
            padding="2"
          />
        </Stack>
      </Box>
      <Grid container justifyContent={'space-between'} alignItems="center">
        <Grid item xs="auto">
          <Title title="Free AI Apps" />
        </Grid>
        <Grid item xs={10}>
          <TagNav tags={tags} onChange={handleTagChange} defaultValue="all" />
        </Grid>
        <Grid item xs="auto" justifySelf="flex-end">
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <AIAppCard apps={aiApps} />
      </Box>
      <Link to="/ai-gallery" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}>
          <Typography sx={{ color: '#fff' }}>View All Free AI Apps ( 325 ) →</Typography>
        </Box>
      </Link>
    </Stack>
  )
}

export default HomePage
