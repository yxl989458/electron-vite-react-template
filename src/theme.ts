import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export let theme = createTheme({
  typography: {
    fontFamily: ['Lucida Grande'].join(','),
    fontWeightRegular: 700,
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a1a',
      paper: '#242424',
    },
    primary: {
      main: '#9c27b0',
    },
  },
})
