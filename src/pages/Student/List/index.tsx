import React from 'react';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Auth } from 'aws-amplify';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const ListStudent = (): JSX.Element => {
  const handleDelete = async (id?: string) => {
    const currentSession = await Auth.currentSession();

    Swal.fire({
      icon: 'question',
      title: 'Atenção!',
      text: 'Deseja realmente excluir o cliente selecionado?',
      showCancelButton: true,
      confirmButtonText: "Sim, confirmar!",
      cancelButtonText: "Não!"
    }).then( async (result) => {
      if(result.isConfirmed){
        try{
          await api.delete(`/customer/${id}`, {
            headers: {
              'X-Cognito-ID-Token': currentSession.getIdToken().getJwtToken()
            }
          });
    
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'O cliente foi excluído com sucesso!'
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
        name="Alunos"
        url="/customer"
        title="ADICIONAR ALUNO"
        formUrl="/student"
        headCells={[
          {id: "name", disablePadding: true, label: "Nome", numeric: false, type: "text" },
          {id: "cpf", disablePadding: true, label: "CPF", numeric: false, type: "cpf" },
          {id: "email", disablePadding: true, label: "Email", numeric: false, type: "text" },
          {id: "birthdate", disablePadding: true, label: "Data de nascimento", numeric: false, type: "date" },
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
        emptyMessage="Nenhum aluno cadastrado!"
        options={
          [
            {
              type: "link",
              link: "/student",
              title: "Visualizar",
              handle: () => {},
              icon: <VisibilityIcon />,
              action: 'view'
            },
            {
              type: "link",
              link: "/student",
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

export default ListStudent;