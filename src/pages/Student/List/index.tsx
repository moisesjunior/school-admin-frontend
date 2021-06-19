import React, { FormEvent } from 'react';
import ContentPage from '../../../components/ContentPage';
import EnhancedTable from '../../../components/Table';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Auth } from 'aws-amplify';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import Filter from '../../../components/Filter';
import { useState } from 'react';
import { Course } from './index.d';
import { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { maskCPF } from '../../../utils/mask';

const ListStudent = (): JSX.Element => {
  const [ url, setUrl ] = useState('/customer');
  const [ nameSearch, setNameSearch ] = useState('');
  const [ cpfSearch, setCpfSearch ] = useState('');
  const [ courseSearch, setCourseSearch ] = useState('');
  const [ statusSearch, setStatusSearch ] = useState('');
  const [ page, setPage ] = useState(0);
  const [ courses, setCourses ] = useState<Course[]>([]);

  useEffect(() => {
    const getData = async () => {
      const userTokens = await Auth.currentSession();
      const response = await api.get('/course', {
        headers: {
          'CognitoIdToken': userTokens.getIdToken().getJwtToken()
        }
      });
      setCourses(response.data);
    }

    getData();
  }, []);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    var params = new URLSearchParams();

    if (nameSearch !== ''){
      params.set("name", nameSearch);
    }
    if (cpfSearch !== ''){
      params.set("cpf", cpfSearch);
    }
    if (courseSearch !== ''){
      params.set("course", courseSearch);
    }
    if (statusSearch !== ''){
      params.set("status", statusSearch);
    }
    setUrl('/customer?' + params.toString());
  }

  const handleClear = () => {
    setUrl('/customer');
    setNameSearch('');
    setCpfSearch('');
    setCourseSearch('');
    setStatusSearch('');
    setPage(0);
  }

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
              'CognitoIdToken': currentSession.getIdToken().getJwtToken()
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
      <Filter onCancel={handleClear} onSubmit={handleFilter} name="Filtro de alunos">
        <FormControl variant="outlined">
          <InputLabel id="labelType">Curso</InputLabel>
          <Select
            labelId="labelType"
            label="Curso"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value as string)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {courses.map(course => (
              <MenuItem value={course.id}>
                {course.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField 
          variant="outlined"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          placeholder="Nome do aluno"
        />
        <TextField 
          variant="outlined"
          value={maskCPF(cpfSearch)}
          onChange={(e) => setCpfSearch(maskCPF(e.target.value))}
          placeholder="CPF"
        />
        <FormControl variant="outlined">
          <InputLabel id="labelType">Status</InputLabel>
          <Select
            labelId="labelType"
            label="Status"
            value={statusSearch}
            onChange={(e) => setStatusSearch(e.target.value as string)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Trancado">Matrícula trancada</MenuItem>
            <MenuItem value="Reprovado">Reprovado</MenuItem>
            <MenuItem value="Desistente">Desistente</MenuItem>
          </Select>
        </FormControl>
      </Filter>
      <EnhancedTable
        page={page}
        name="Alunos"
        url={url}
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