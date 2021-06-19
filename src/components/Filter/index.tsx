import { IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import Buttons from '../Buttons';
import { IFilter } from './index.d'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      paddingBottom: '15px',
      justifyContent: 'space-between'
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
    hidden: {
      display: 'none'
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
  const [ hidden, setHidden ] = useState(true);

  return (
    <div className={classes.main}>
      <form onSubmit={props.onSubmit} action="">
        <div className={classes.title}>
          <h2>{props.name}</h2>
          <IconButton onClick={() => setHidden(!hidden)} aria-label="delete">
            {hidden ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> }
          </IconButton>
        </div>
        <div className={hidden === true ? classes.hidden : classes.inputs}>
          {props.children}
        </div>
        <Buttons 
          onCancel={props.onCancel}
          cancelText="Limpar dados"
          submitText="Filtrar"
          cancelIcon={<ClearIcon />}
          submitIcon={<SearchIcon />}
          hidden={hidden}
        />
      </form>
    </div>
  )
}

export default Filter;