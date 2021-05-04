import React from 'react';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Auth } from 'aws-amplify';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const ListExpenditure = (): JSX.Element => {
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
      <EnhancedTable
        name="Despesas"
        url="/expenditure"
        title="ADICIONAR DESPESA"
        formUrl="/expenditure"
        headCells={[
          {id: "description", disablePadding: true, label: "Descrição", numeric: false, type: "text" },
          {id: "referenceDate", disablePadding: true, label: "Referência", numeric: false, type: "dateReference" },
          {id: "expenditureType", disablePadding: true, label: "Tipo da despesa", numeric: false, type: "text" },
          {id: "dueDate", disablePadding: true, label: "Vencimento", numeric: false, type: "date" },
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
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