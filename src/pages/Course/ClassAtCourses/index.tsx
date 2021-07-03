/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { format } from 'date-fns';
import { maskCPF } from '../../../utils/mask';

interface State {
  id: string;
  name: string;
}

const ClassAtCourses = (): JSX.Element => {
  const location = useLocation<State>();

  return (
    <ContentPage>
      <EnhancedTable
        name={`Classe - ${location.state.name}`}
        url={`/customer?course=${location.state.id}`}
        headCells={[
          {id: "name", disablePadding: true, label: "Nome", numeric: false, type: "text" },
          {id: "cpf", disablePadding: true, label: "CPF", numeric: false, type: "cpf" },
          {id: "email", disablePadding: true, label: "Email", numeric: false, type: "text" },
          {id: "birthdate", disablePadding: true, label: "Data de nascimento", numeric: false, type: "date" },
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
        selectedCells={(value: any) => ({
          name: value.name,
          cpf: maskCPF(value.cpf),
          email: value.email,
          birthdate: format(new Date(value.birthdate), "dd/MM/yyyy"),
        })}
        emptyMessage="Nenhum aluno cadastrado nesse curso!"
        options={
          [{
            type: "link",
            link: `/student`,
            title: "Visualizar",
            handle: () => {},
            icon: <VisibilityIcon />,
            action: 'view'
          }]
        }
      />
    </ContentPage>
  )
}

export default ClassAtCourses;