import { Typography } from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface IFilter {
  children: JSX.Element | JSX.Element[];
  name: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flex: '1 1 100%',
      paddingBottom: '15px'
    },
    main: {
      display: 'block',
      gap: '10px',
      padding: '8px 16px',
      marginBottom: '2%',
      borderRadius: '4px',
      boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    }
  }),
);

const Filter = (props: IFilter) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        {props.name}
      </Typography>
      {props.children}
    </div>
  )
}

export default Filter;