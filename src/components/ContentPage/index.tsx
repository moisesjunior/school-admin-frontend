import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      margin: "90px 30px 0 90px",
      backgroundColor: "#FFFFFF"
    }
  })
);

interface ContentPageDTO {
  children: JSX.Element[];
}

export default function ContentPage(props: ContentPageDTO) {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      {props.children}
    </main>
  )
}
