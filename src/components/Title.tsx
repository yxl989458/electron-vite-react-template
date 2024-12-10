import { Typography } from "@mui/material";

interface Props {
    title:string
}

export default function Title({title}:Props) {
    return <>
      <Typography sx={{fontSize:24}}>{title}</Typography>
    </>
}