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
    try{
      const currentSession = await Auth.currentSession();
      await api.delete(`/payment/${id}`, {
        headers: {
          'X-Cognito-ID-Token': currentSession.getIdToken().getJwtToken()
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'O cliente foi excluído com sucesso!'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: error.response.data.title,
        text: error.response.data.text,
      });
    }
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
              link: "/customer",
              title: "Visualizar",
              handle: () => {},
              icon: <VisibilityIcon />
            },
            {
              type: "link",
              link: "/customer",
              title: "Editar",
              handle: () => {},
              icon: <CreateIcon />
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