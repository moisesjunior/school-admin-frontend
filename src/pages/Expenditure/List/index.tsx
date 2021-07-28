import React, { FormEvent, useState } from 'react';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Auth } from 'aws-amplify';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import Filter from '../../../components/Filter';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';

const ListExpenditure = (): JSX.Element => {
  const [ referenceDateSearch, setReferenceDateSearch ] = useState<Date | null>(null);
  const [ expenditureTypeSearch, setExpenditureTypeSearch ] = useState('');
  const [ url, setUrl ] = useState('/expenditure');
  const [ page, setPage ] = useState(0);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const dateFilter = referenceDateSearch || '';
    var params = new URLSearchParams();


    if (dateFilter !== '') {
      params.set("referenceDate", dateFilter.toDateString());
    }
    if (expenditureTypeSearch !== ''){
      params.set("expenditureType", expenditureTypeSearch);
    }
    setUrl('/expenditure?' + params.toString());
  }

  const handleClear = () => {
    setUrl('/expenditure');
    setExpenditureTypeSearch('');
    setReferenceDateSearch(null);
    setPage(0);
  }

  const handleDelete = async (id?: string) => {
    const currentSession = await Auth.currentSession();

    Swal.fire({
      icon: 'question',
      title: 'Atenção!',
      text: 'Deseja realmente excluir a despesa selecionada?',
      showCancelButton: true,
      confirmButtonText: "Sim, confirmar!",
      cancelButtonText: "Não!"
    }).then( async (result) => {
      if(result.isConfirmed){
        try{
          await api.delete(`/expenditure/${id}`, {
            headers: {
              'CognitoIdToken': currentSession.getIdToken().getJwtToken()
            }
          });
    
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'A despesa foi excluída com sucesso!'
          }).then(result => {
            window.location.reload(false);
          });
        } catch(error) {
          Swal.fire({
            icon: 'error',
            title: error.response.data.title,
            text: error.response.data.text,
          });
        }
      } else {
        Swal.close();
      }
    });
  }

  return (
    <ContentPage>
      <Filter onCancel={handleClear} onSubmit={handleFilter} name="Filtro de despesas">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            inputVariant="outlined"
            openTo="year"
            label="Mês de referência"
            views={['year', 'month']}
            value={referenceDateSearch}
            onChange={(value) => {
              setReferenceDateSearch(value);
            }}
            format="MM/yyyy"
          />
        </MuiPickersUtilsProvider>
        <FormControl variant="outlined">
          <InputLabel id="labelType">Tipo da despesa</InputLabel>
          <Select
            labelId="labelType"
            label="Tipo da despesa"
            value={expenditureTypeSearch}
            onChange={(e) => setExpenditureTypeSearch(e.target.value as string)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="FIXA">Fixa</MenuItem>
            <MenuItem value="VARIÁVEL">Variável</MenuItem>
            <MenuItem value="DEISE PARTICULAR">Deise Particular</MenuItem>
            <MenuItem value="JULIO PARTICULAR">Júlio Particular</MenuItem>
            <MenuItem value="SD">SD</MenuItem>
            <MenuItem value="Identificação">Identificação</MenuItem>
            <MenuItem value="Financeira">Financeira</MenuItem>
          </Select>
        </FormControl>
      </Filter>
      <EnhancedTable
        page={page}
        name="Despesas"
        url={url}
        title="ADICIONAR DESPESA"
        filter="FILTRO DE DADOS"
        formUrl="/expenditure"
        headCells={[
          {id: "description", disablePadding: true, label: "Descrição", numeric: false, type: "text" },
          {id: "referenceDate", disablePadding: true, label: "Referência", numeric: false, type: "dateReference" },
          {id: "expenditureType", disablePadding: true, label: "Tipo da despesa", numeric: false, type: "text" },
          {id: "dueDate", disablePadding: true, label: "Vencimento", numeric: false, type: "date" },
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
        selectedCells={(value: any) => ({
          description: value.description,
          referenceDate: format(new Date(value.referenceDate), "MM/yyyy"),
          expenditureType: value.expenditureType,
          dueDate: format(new Date(value.dueDate), "dd/MM/yyyy"),
        })}
        emptyMessage="Nenhuma despesa cadastrada!"
        options={
          [
            {
              type: "link",
              link: "/expenditure",
              title: "Visualizar",
              handle: () => {},
              icon: <VisibilityIcon />,
              action: 'view'
            },
            {
              type: "link",
              link: "/expenditure",
              title: "Editar",
              handle: () => {},
              icon: <CreateIcon />,
              action: 'edit'
            },
            {
              type: "button",
              handle: handleDelete,
              title: "Excluir",
              icon: <DeleteIcon />
            }
          ]
        }
      />
    </ContentPage>
  )
}

export default ListExpenditure;