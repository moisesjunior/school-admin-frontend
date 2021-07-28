import { IconButton, Toolbar, Typography, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { NavLink } from 'react-router-dom';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import { IToolbar }  from './index.d';
import clsx from 'clsx';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    }
  }),
);

export default function Toolsbar (props: IToolbar) {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root)}
    >
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        {props.name}
      </Typography>
      {props.title !== undefined && props.url !== undefined && 
        <NavLink to={props.url}>
          <Tooltip title={props.title}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </NavLink>
      }
      { props.handleFilter !== undefined && props.filter !== undefined &&
        <Tooltip title={props.filter} onClick={() => props.handleFilter}>
          <IconButton>
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
    </Toolbar>
  );
};