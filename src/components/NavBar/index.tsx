import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SchoolIcon from '@material-ui/icons/School';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import logo from '../../assets/logo_menu.png'
import { UIStore } from '../../services/Store';
import { useHistory } from 'react-router';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: "#FF8066"
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    paperRoot: {
      backgroundColor: "#FF8066"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

const NavBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [ open, setOpen ] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    localStorage.clear();
    UIStore.update(s => {
      s.signed = false
    });
    history.push('/');
  }

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={
          clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })
      }
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
          root: classes.paperRoot
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={"Página Inicial"}>
            <ListItemIcon>
              <HomeIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={"Página Inicial"} />
          </ListItem>
          <ListItem button key={"Alunos"}>
            <ListItemIcon>
              <AccountCircleIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={"Alunos"} />
          </ListItem>
          <ListItem button key={"Finanças"}>
            <ListItemIcon>
              <AttachMoneyIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={"Finanças"} />
          </ListItem>
          <ListItem button key={"Cursos"}>
            <ListItemIcon>
              <SchoolIcon color="error"/>
            </ListItemIcon>
            <ListItemText primary={"Cursos"} />
          </ListItem>
          <ListItem button key={"Alunos"}>
            <ListItemIcon>
              <PersonIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={"Alunos "} />
          </ListItem>
          <ListItem button onClick={() => handleLogout()} key={"Sair"}>
            <ListItemIcon >
              <ExitToAppIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={"Sair"} />
          </ListItem>
        </List>
        <Divider />
        <img style={{
          marginTop: '10px'
        }}  src={logo} alt=""/>
      </Drawer>
    </div>
  )
}

export default NavBar;