import React, { useState } from 'react';
import { Button, makeStyles, createStyles, Theme, MenuProps, Menu, withStyles, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { IOptions } from './index.d';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    button: {
      backgroundColor: "#FF8066",
      color: "#FFFFFF"
    },
    link: {
      textDecoration: "none",
      color: "#000"
    }
  })
);

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: "#FF8066",
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Options(props: IOptions) {
  const classes = useStyles();
  const [ id, setId ] = useState('');
  const [ description, setDescription ] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
    setId('');
    setDescription('');
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string, description?: string) => {
    setAnchorEl(event.currentTarget);
    setId(id);

    if(description !== undefined){
      setDescription(description)
    }
  };

  return (
    <>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        classes={{
          root: classes.button
        }}
        onClick={(e) => handleClick(e, props.id as string)}
      >
        Ações
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.option.map(option => {
          if(option.type === 'button' && option.handle !== undefined){
            return (
              <StyledMenuItem
                onClick={() => {
                  handleClose();
                  option.handle(id as string);
                }}
              >
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.title} />
              </StyledMenuItem>
            )
          } else {
            return (
              <NavLink to={{
                pathname: option.link,
                state: {
                  id: id,
                  action: option.action,
                  name: description
                }
              }}
              className={classes.link}
              >
                <StyledMenuItem>
                  <ListItemIcon>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText primary={option.title} />
                </StyledMenuItem>
              </NavLink>
            )
          }
        })}
      </StyledMenu>
    </>
  )
}