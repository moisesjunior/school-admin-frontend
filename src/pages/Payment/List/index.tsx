import React from 'react';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Auth } from 'aws-amplify';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const ListPayment = (): JSX.Element => {
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
      <EnhancedTable
        name="Pagamentos"
        url="/payment"
        title="ADICIONAR PAGAMENTO"
        formUrl="/payment"
        headCells={[
          {id: "customer", disablePadding: true, label: "Cliente", numeric: false, type: "text" },
          {id: "description", disablePadding: true, label: "Descrição", numeric: false, type: "text" },
          {id: "type", disablePadding: true, label: "Tipo", numeric: false, type: "text" },
          {id: "dueDate", disablePadding: true, label: "Vencimento", numeric: false, type: "dueDate" },          
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
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