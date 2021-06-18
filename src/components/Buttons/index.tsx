import React, { useEffect } from 'react';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
interface IButton {
  cancelText: string;
  submitText: string;
  cancelIcon: JSX.Element;
  submitIcon: JSX.Element;
  hidden?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hidden:{
      display: 'none'
    },
    button: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'flex-end',
      '@media (max-width: 490px)': {
        display: 'flex',
        flexDirection: 'column',
      }
    },
    cancel: {
      marginRight: '20px',
      '@media (max-width: 490px)': {
        width: '100%',
        marginBottom: '10px'
      }
    }

  })
);

const Buttons = (props: IButton) => {
  const classes = useStyles();

  useEffect(() => {
  }, [props.hidden])

  return (
    <div className={props.hidden === true ? classes.hidden : classes.button}>
      <Button
        variant="outlined"
        startIcon={props.cancelIcon}
        color="secondary"
        classes={{
          root: classes.cancel
        }}
      >
        {props.cancelText}
      </Button>
      <Button
        type="submit"
        variant="outlined"
        startIcon={props.submitIcon}
        color="primary"
      >
        {props.submitText}
      </Button>
    </div>
  )
}

export default Buttons;