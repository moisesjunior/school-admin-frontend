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
    try{
      const currentSession = await Auth.currentSession();
      await api.delete(`/expenditure/${id}`, {
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
        name="Despesas"
        url="/expenditure"
        title="ADICIONAR DESPESA"
        formUrl="/expenditure"
        headCells={[
          {id: "description", disablePadding: true, label: "Descrição", numeric: false, type: "text" },
          {id: "referenceDate", disablePadding: true, label: "Referência", numeric: false, type: "date" },
          {id: "expenditureType", disablePadding: true, label: "Tipo", numeric: false, type: "text" },
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
              icon: <VisibilityIcon />
            },
            {
              type: "link",
              link: "/expenditure",
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

export default ListExpenditure;