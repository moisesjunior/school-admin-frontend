import React, { FormEvent, useState } from 'react';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Auth } from 'aws-amplify';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Student } from '../../Student/List/index.d';
import { useEffect } from 'react';
import Filter from '../../../components/Filter';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const ListPayment = (): JSX.Element => {
  const [ customers, setCustomers ] = useState<Student[]>([]);
  const [ customerSearch, setCustomerSearch ] = useState<Student | null>(null);
  const [ typeSearch, setTypeSearch ] = useState('');
  const [ url, setUrl ] = useState('/payment');
  const [ page, setPage ] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const user = await Auth.currentSession();

      const response = await api.get('/customer', {
        headers: {
          'CognitoIdToken': user.getIdToken().getJwtToken()
        }
      });

      setCustomers(response.data);
    }

    getData();
  }, [])

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (customerSearch !== null){
      params.set("customer", customerSearch.id);
    }
    if (typeSearch !== ''){
      params.set("type", typeSearch);
    }
    
    setUrl('/payment?' + params.toString());
  }

  const handleClear = () => {
    setUrl('/payment');
    setCustomerSearch(null);
    setTypeSearch('');
    setPage(0);
  }

  const handleDelete = async (id?: string) => {
    const currentSession = await Auth.currentSession();

    Swal.fire({
      icon: 'question',
      title: 'Atenção!',
      text: 'Deseja realmente excluir o pagamento selecionado?',
      showCancelButton: true,
      confirmButtonText: "Sim, confirmar!",
      cancelButtonText: "Não!"
    }).then( async (result) => {
      if(result.isConfirmed){
        try{
          await api.delete(`/payment/${id}`, {
            headers: {
              'CognitoIdToken': currentSession.getIdToken().getJwtToken()
            }
          });
    
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'O pagamento foi excluído com sucesso!'
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
      <Filter onCancel={handleClear} onSubmit={handleFilter} name="Filtro de pagamentos">
        <FormControl variant="outlined">
          <Autocomplete
            fullWidth
            value={customerSearch}
            onChange={(event, value) => setCustomerSearch(value !== null ? value : null)}
            options={customers}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Selecione o cliente..." variant="outlined" />}
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel id="labelType">Selecione o status</InputLabel>
          <Select
            labelId="labelType"
            label="Status"
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value as string)}
          >
            <MenuItem value="Mensalidade">Mensalidade</MenuItem>
            <MenuItem value="Dependẽncia">Dependência</MenuItem>
            <MenuItem value="Matrícula">Matrícula</MenuItem>
            <MenuItem value="Falta (Estágio)">Falta (Estágio)</MenuItem>
            <MenuItem value="Outros">Outros</MenuItem>
          </Select>
        </FormControl>
      </Filter>
      <EnhancedTable
        name="Pagamentos"
        url={url}
        page={page}
        title="ADICIONAR PAGAMENTO"
        formUrl="/payment"
        headCells={[
          {id: "customer", disablePadding: true, label: "Cliente", numeric: false, type: "text" },
          {id: "description", disablePadding: true, label: "Descrição", numeric: false, type: "text" },
          {id: "type", disablePadding: true, label: "Tipo", numeric: false, type: "text" },
          {id: "dueDate", disablePadding: true, label: "Vencimento", numeric: false, type: "dueDate" },          
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
        selectedCells={(value: any) => ({
          customer: value.customer.name,
          description: value.description,
          type: value.type,
          dueDate: format(new Date(value.dueDate), "dd/MM/yyyy")
        })}
        emptyMessage="Nenhum pagamento cadastrado!"
        options={
          [
            {
              type: "link",
              link: "/payment",
              title: "Visualizar",
              handle: () => {},
              icon: <VisibilityIcon />,
              action: 'view',
            },
            {
              type: "link",
              link: "/payment",
              title: "Editar",
              handle: () => {},
              icon: <CreateIcon />,
              action: 'edit',
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

export default ListPayment;