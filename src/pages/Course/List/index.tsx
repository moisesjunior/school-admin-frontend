import React from 'react';
import Auth from '@aws-amplify/auth';
import Swal from 'sweetalert2';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import api from '../../../services/api';
import ListIcon from '@material-ui/icons/List';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';

const ListCourse = (): JSX.Element => {
  const handleDelete = async (id?: string) => {
    try{
      const currentSession = await Auth.currentSession();
      await api.delete(`/course/${id}`, {
        headers: {
          'X-Cognito-ID-Token': currentSession.getIdToken().getJwtToken()
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'O curso foi excluído com sucesso!'
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
        name="Cursos"
        url="/course"
        title="ADICIONAR CURSO"
        formUrl="/course"
        headCells={[
          {id: "description", disablePadding: true, label: "Descrição", numeric: false, type: "text" },
          {id: "startAt", disablePadding: true, label: "Início", numeric: false, type: "date" },
          {id: "endAt", disablePadding: true, label: "Final", numeric: false, type: "date" },
          {id: "monthlyPayment", disablePadding: true, label: "Mensalidade", numeric: false, type: "money" },
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
        emptyMessage="Nenhum curso cadastrado!"
        options={
          [
            {
              type: "link",
              link: "/classes",
              title: "Listar alunos",
              handle: () => {},
              icon: <ListIcon />
            },
            {
              type: "link",
              link: "/course",
              title: "Visualizar",
              handle: () => {},
              icon: <VisibilityIcon />
            },
            {
              type: "link",
              link: "/course",
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

export default ListCourse;