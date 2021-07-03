import { TablePagination } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { IPagination } from './index.d';

export default function Pagination (props: IPagination) {
  const [ state, setState ] = useState<IPagination>({
    page: 0,
    component: 'div',
    rowsPerPage: 0,
    totalOfRows: 0,
    quantityOfRows: [ 0 ],
    onChangePage: props.onChangePage,
    onChangeRowsPerPage: props.onChangeRowsPerPage,
  });

  useEffect(() => {
    setState({
      ...state,
      page: props.page,
      rowsPerPage: props.rowsPerPage,
      totalOfRows: props.totalOfRows
    })
  }, [props.page, props.rowsPerPage, props.totalOfRows ])

  return (
    <TablePagination
      rowsPerPageOptions={props.quantityOfRows}
      component="div"
      count={props.totalOfRows}
      rowsPerPage={props.rowsPerPage}
      page={state.page}
      onChangePage={props.onChangePage}
      onChangeRowsPerPage={props.onChangeRowsPerPage}
    />
  )
}