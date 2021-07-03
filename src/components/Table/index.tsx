/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import api from '../../services/api';
import Auth from '@aws-amplify/auth';
import Toolsbar from './Toolbar';
import Header from './Header';
import Pagination from './Pagination/index';
import { ITable } from './index.d';
import Rows from './Rows';

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
    }
  }),
);

export default function EnhancedTable(props: ITable) {
  const classes = useStyles();
  const [ order, setOrder ] = useState<'asc' | 'desc'>('asc');
  const [ orderBy, setOrderBy ] = useState<string>('calories');
  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    const result = async () => {
      const currentSession = await Auth.currentSession();

      const response = await api.get(props.url, {
        headers: {
          'CognitoIdToken': currentSession.getIdToken().getJwtToken()
        }
      });

      setRows(response.data);
      if(props.page !== undefined){
        setPage(props.page);
      }
    }
    
    result();
  }, [props.url, props.page]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolsbar 
          name={props.name}
          title={props.title} 
          url={props.formUrl}
          handleFilter={props.handleFilter}
          filter={props.filter}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <Header
              headCells={props.headCells}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              <Rows 
                selectedCells={props.selectedCells}
                emptyRows={emptyRows}
                headCells={props.headCells}
                name={props.name}
                options={props.options}
                order={order}
                orderBy={orderBy}
                page={page}
                rows={rows}
                rowsPerPage={rowsPerPage}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          quantityOfRows={[5, 10, 25]}
          component="div"
          totalOfRows={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(event: unknown, newPage: number) => {
            setPage(newPage)
          }}
          onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </div>
  );
}
