import { Box, Tabs, Tab, styled } from '@mui/material'
import { useState } from 'react'

interface TagItem {
  label: string
  value: string
}

interface TagNavProps {
  tags: TagItem[]
  onChange?: (value: string) => void
  defaultValue?: string
}

const StyledTabs = styled(Tabs)({
  minHeight: '28px',

  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: '8px',
  },
})

const StyledTab = styled(Tab)({
  minHeight: '28px',

  padding: '4px 12px',
  color: '#fff',
  fontSize: '14px',
  textTransform: 'none',
  borderRadius: '4px',
  minWidth: 'unset',
  backgroundColor: '#363638',
  marginRight: '0',
  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: '#8B5AD0',
  },
  '&:hover': {
    backgroundColor: 'rgba(139, 90, 208, 0.8)',
  },
})

export const TagNav = ({ tags, onChange, defaultValue = 'all' }: TagNavProps) => {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <StyledTabs value={value} onChange={handleChange} variant="scrollable" scrollButtons={false}>
      {tags.map((tag) => (
        <StyledTab key={tag.value} label={tag.label} value={tag.value} />
      ))}
    </StyledTabs>
  )
}
