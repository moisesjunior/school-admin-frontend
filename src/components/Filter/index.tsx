import { Typography } from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import Buttons from '../Buttons';

interface IFilter {
  children: JSX.Element | JSX.Element[];
  name: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      paddingBottom: '15px'
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      padding: '8px 16px',
      marginBottom: '2%',
      borderRadius: '4px',
      boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    },
    inputs: {
      display: 'flex',
      '@media screen and (max-width: 640px)': {
        flexDirection: 'column'
      },
      '& > *': {
        marginBottom: '10px',
        marginRight: '20px',
        width: '25%',
        '@media screen and (max-width: 991px)': {
          width: '100%',
        }
      },
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
      <div className={classes.inputs}>
        {props.children}
      </div>
      <Buttons 
        cancelText="Limpar dados"
        submitText="Filtrar"
        cancelIcon={<ClearIcon />}
        submitIcon={<SearchIcon />}
      />
    </div>
  )
}

export default Filter;