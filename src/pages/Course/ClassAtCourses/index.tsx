import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';

interface State {
  id: string;
  name: string;
}

const ClassAtCourses = (): JSX.Element => {
  const location = useLocation<State>();
  const [ id, setId ] = useState('');
  const [ name, setName ] = useState('');

  useEffect(() => {
    if(location.state !== undefined){
      setId(location.state.id);
      setName(location.state.name);
    }
  }, [location.state])

  return (
    <ContentPage>
      <EnhancedTable
        name={`Classe - ${name}`}
        url="/course"
        headCells={[
          {id: "name", disablePadding: true, label: "Nome", numeric: false, type: "text" },
          {id: "cpf", disablePadding: true, label: "CPF", numeric: false, type: "cpf" },
          {id: "email", disablePadding: true, label: "Email", numeric: false, type: "text" },
          {id: "birthdate", disablePadding: true, label: "Data de nascimento", numeric: false, type: "date" },
          {id: "options", disablePadding: true, label: "", numeric: false }
        ]}
        emptyMessage="Nenhum aluno cadastrado nesse curso!"
        options={
          [{
            type: "link",
            link: `/customer?course=${id}`,
            title: "Visualizar",
            handle: () => {},
            icon: <VisibilityIcon />
          }]
        }
      />
    </ContentPage>
  )
}

export default ClassAtCourses;