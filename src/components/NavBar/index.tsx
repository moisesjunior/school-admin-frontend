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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PollIcon from '@material-ui/icons/Poll';
import logo from '../../assets/logo_menu.png'
import { UIStore } from '../../services/Store';
import { useHistory, NavLink as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
const drawerWidth = 240;

interface ListItemLinkProps {
  icon: React.ReactElement;
  primary: string;
  to: string;
  handle: () => void;
}

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
      backgroundColor: "#FF8066",
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      backgroundColor: "#FF8066",
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
    },
    toolbar: {
      backgroundColor: "#FF8066",
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
    active: {
      backgroundColor: "#ff0000"
    },
    icon: {
      color: "#FFF"
    },
    list: {
      backgroundColor: "#FF8066",
      color: "#FFF"
    }
  }),
);

const NavBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [ open, setOpen ] = React.useState(false);
  
  function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;
  
    const renderLink = React.useMemo(
      () =>
        React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
          <RouterLink onClick={props.handle} activeClassName={classes.active}  to={to} ref={ref} {...itemProps} />
        )),
      [to, props.handle],
    );
  
    return (
      <li>
        <ListItem button component={renderLink}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await Auth.signOut();
    localStorage.clear();
    UIStore.update(s => {
      s.signed = false
    });
    history.push('/');
  }

  return (
    <div className={classes.paperRoot}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={
          clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })
        }
        classes={{
          root: classes.paperRoot
        }}
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
        <Divider 
          classes={{
            root: classes.paperRoot
          }}
        />
        <List
          classes={{
            root: classes.list
          }}
        >
          <ListItemLink 
            handle={handleDrawerClose}
            icon={
              <HomeIcon 
                classes={{
                  root: classes.icon
                }}
              />
            } 
            to="home" 
            primary="Página Inicial"
          />
          <ListItemLink 
            handle={handleDrawerClose}
            icon={
              <AccountCircleIcon
                classes={{
                  root: classes.icon
                }}
              />
            } 
            to="students" 
            primary="Alunos"
          />
          <ListItemLink
            handle={handleDrawerClose}
            icon={
              <SchoolIcon
                classes={{
                  root: classes.icon
                }}
              />
            } 
            to="courses" 
            primary="Cursos"
          />
          <ListItemLink 
            handle={handleDrawerClose}
            icon={
              <AttachMoneyIcon
                classes={{
                  root: classes.icon
                }}
              />
            } 
            to="payments" 
            primary="Contas a receber"
          />
          <ListItemLink
            handle={handleDrawerClose} 
            icon={
              <MoneyOffIcon
                classes={{
                  root: classes.icon
                }}
              />
            }
            to="expenditures"
            primary="Contas a pagar"
          />
          <ListItemLink
            handle={handleDrawerClose} 
            icon={
              <PollIcon
                classes={{
                  root: classes.icon
                }}
              />
            }
            to="cashFlow"
            primary="Fluxo de caixa"
          />
          <ListItem button onClick={() => handleLogout()} key={"Sair"}>
            <ListItemIcon >
              <ExitToAppIcon
                classes={{
                  root: classes.icon
                }}
              />
            </ListItemIcon>
            <ListItemText primary={"Sair"} />
          </ListItem>
        </List>
        <Divider 
          classes={{
            root: classes.paperRoot
          }}
        />
        <img style={{
          borderRadius: "50%",
          backgroundColor: "#FFF"
        }}  src={logo} alt="Escola CICI"/>
      </Drawer>
    </div>
  )
}

export default NavBar;