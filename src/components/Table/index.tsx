/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { withStyles, createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import api from '../../services/api';
import { NavLink } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import { Button, ListItemIcon, ListItemText } from '@material-ui/core';
import { format } from 'date-fns';

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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  type?: "date" | "money" | "text" | "cpf";
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {props.headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

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

interface ToolbarProps {
  name: string;
  url?: string;
  title?: string;
}

const EnhancedTableToolbar = (props: ToolbarProps) => {
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
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    button: {
      backgroundColor: "#FF8066",
      color: "#FFFFFF"
    },
    link: {
      textDecoration: "none",
      color: "#000"
    }
  }),
);

interface OptionsProp {
  type: "link" | "button";
  handle: (id?: string) => void;
  link?: string;
  title: string;
  icon: JSX.Element;
  action?: "view" | "edit"
}

interface TableProps {
  name: string;
  url: string;
  headCells: HeadCell[];
  title?: string;
  formUrl?: string;
  emptyMessage: string;
  options: OptionsProp[];
}

export default function EnhancedTable(props: TableProps) {
  const classes = useStyles();
  const [ order, setOrder ] = useState<Order>('asc');
  const [ orderBy, setOrderBy ] = useState<string>('calories');
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [ rows, setRows ] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    const result = async () => {
      const currentUser = await Auth.currentSession();

      const response = await api.get(props.url, {
        headers: {
          'Cognito-ID-Token': currentUser.getIdToken().getJwtToken()
        }
      });

      setRows(response.data);
    }
    
    result();
  }, [props.url]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar 
          name={props.name}
          title={props.title} 
          url={props.formUrl}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              headCells={props.headCells}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              { rows.length > 0 && stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      {
                        props.headCells.map(headCell => {
                          if(headCell.id !== 'options'){
                            return (
                              <TableCell>
                                {headCell.type === "cpf" && 
                                  (row[headCell.id] as string).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                                }

                                {headCell.type === "date" && 
                                  format(new Date(row[headCell.id]), "dd/MM/yyyy")
                                }

                                {headCell.type === "money" && 
                                  "R$ " + Number(row[headCell.id]).toFixed(2)
                                }

                                {headCell.type === "text" && 
                                  (typeof row[headCell.id] === "object" ? (row[headCell.id] as any).name : row[headCell.id])
                                }                                
                              </TableCell>
                            )
                          } else {
                            return (
                              <TableCell>
                                <Button
                                  aria-controls="customized-menu"
                                  aria-haspopup="true"
                                  classes={{
                                    root: classes.button
                                  }}
                                  onClick={handleClick}
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
                                  {props.options.map(option => {
                                    if(option.type === 'button' && option.handle !== undefined){
                                      return (
                                        <StyledMenuItem
                                          onClick={() => {
                                            handleClose();
                                            option.handle(row.id as string);
                                          }}
                                        >
                                          <ListItemIcon>
                                            {option.icon}
                                          </ListItemIcon>
                                          <ListItemText primary={option.title} />
                                        </StyledMenuItem>
                                      )
                                    }

                                    if(option.type === 'link'){
                                      return (
                                        <NavLink to={{
                                          pathname: option.link,
                                          state: {
                                            id: row.id,
                                            action: option.action,
                                            name: ( props.name === 'Cursos' ? row.description : undefined)
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
                              </TableCell>
                            )
                          }
                        })
                      }
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && rows.length === 0 && (
                <TableRow style={{ height: 10 * emptyRows }}>
                  <TableCell align="center" colSpan={6}>
                    <h2>{props.emptyMessage}</h2>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
