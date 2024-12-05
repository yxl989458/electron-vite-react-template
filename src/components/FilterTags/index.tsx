import { Box, Chip } from '@mui/material'

interface FilterTagsProps {
  tags: string[]
  selectedTag: string
  onTagSelect: (tag: string) => void
}

export function FilterTags({ tags, selectedTag, onTagSelect }: FilterTagsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        mb: 3,
        '& .MuiChip-root': {
          borderRadius: '16px',
          fontSize: '0.875rem',
          height: '28px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
          },
        },
      }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          onClick={() => onTagSelect(tag)}
          color={selectedTag === tag ? 'primary' : 'default'}
          variant={selectedTag === tag ? 'filled' : 'outlined'}
          className={selectedTag === tag ? 'Mui-selected' : ''}
        />
      ))}
    </Box>
  )
}
