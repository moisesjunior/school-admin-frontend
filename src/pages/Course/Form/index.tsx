import { Button, FormControl, TextField } from '@material-ui/core';
import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import ContentPage from '../../../components/ContentPage';
import api from '../../../services/api';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBack';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import NumberFormat from 'react-number-format';

interface State {
  id: string;
  action: 'edit' | 'view';
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 2fr)',
      gridGap: '10px',
      marginTop: '20px',
      gridTemplateRows: 'repeat(2, 1fr)',
      '@media screen and (max-width: 875px) and (min-width: 700px)': {
        gridTemplateColumns: 'repeat(3, 2fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
      },
      '@media screen and (max-width: 699px)': {
        gridTemplateColumns: 'repeat(1, 2fr)',
      }
    },
    button: {
      '& > *': {
        margin: theme.spacing(1),
      },
      display: "block",
      gridColumnStart: 4,
      gridColumnEnd: 5,
      '@media screen and (max-width: 875px) and (min-width: 700px)': {
        gridColumnStart: 3,
        gridColumnEnd: 4,
      },
      '@media screen and (max-width: 699px)': {
        gridColumnStart: 1,
        gridColumnEnd: 1
      }
    }
  })
)

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalSeparator={'.'}
      isNumericString
      decimalScale={1}
    />
  );
}

const FormCourse = (): JSX.Element => {
  const classes = useStyles();
  const location = useLocation<State>();
  const history = useHistory();
  const [ id, setId ] = useState('');
  const [ action, setAction ] = useState('save');
  const [ description, setDescription ] = useState('');
  const [ startAt, setStartAt ] = useState<Date | null>(null);
  const [ endAt, setEndAt ] = useState<Date | null>(null);
  const [ monthlyPayment, setMonthlyPayment ] = useState<Number | null>(null);

  useEffect(() => {
    if(location.state !== undefined && location.state !== null){
      setId(location.state.id);
      setAction(location.state.action);

      const result = async () => {
        const response = await api.get(`/course/${location.state.id}`);
        setDescription(response.data.description);
        setStartAt(response.data.startAt);
        setEndAt(response.data.endAt);
        setMonthlyPayment(response.data.monthlyPayment);
      }

      result();
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if((startAt !== null && endAt !== null) && startAt > endAt){
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'A data final não pode ser menor que a data inicial'
      });

      return;
    }
    try {
      if(id !== ''){
        await api.put(`/course/${id}`,{
          description,
          startAt,
          endAt,
          monthlyPayment
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Curso atualizado com sucesso!',
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          showCancelButton: true,
          confirmButtonText: "Cadastrar outro!",
          cancelButtonText: "Voltar"
        }).then(result => {
          if(result.isConfirmed){
            window.location.reload(false);
          } else {
            history.push('/courses');
          }
        });
  
      } else {
        await api.post('/course',{
          description,
          startAt,
          endAt,
          monthlyPayment
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Curso criado com sucesso!',
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          showCancelButton: true,
          confirmButtonText: "Cadastrar outro!",
          cancelButtonText: "Voltar"
        }).then(result => {
          if(result.isConfirmed){
            window.location.reload(false);
          } else {
            history.push('/courses');
          }
        });
      } 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Ocorreu um erro ao salvar o curso!'
      });
    }
  }

  return (
    <ContentPage>
      <h2>Formulário - Curso</h2>
      <form className={classes.form} onSubmit={handleSubmit}>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            required 
            variant="outlined" 
            label="Descrição" 
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Início"
              views={['year', 'month', 'date']}
              value={startAt}
              onChange={(value) => {
                setStartAt(value)
              }}
              required
              format="dd/MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Fim"
              views={['year', 'month', 'date']}
              value={endAt}
              minDate={startAt !== null ? startAt : new Date(1900, 1, 1)}
              minDateMessage={startAt !== null ? "A data final não pode ser menor que a data inicial!" : "A data precisa ser maior que 31/01/1900!"}
              onChange={(value) => {
                setEndAt(value)
              }}
              required
              format="dd/MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            required 
            variant="outlined" 
            label="Valor da mensalidade"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(Number(e.target.value))}
            InputProps={{
              inputComponent: NumberFormatCustom as any
            }}
          />
        </FormControl>
        <FormControl className={classes.button}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<BackIcon />}
            onClick={() => { history.push('/courses') }}
          >
            Cancelar
          </Button>
          <Button
            disabled={action !== 'view' ? false : true}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            type="submit"
          >
            Salvar
          </Button>
        </FormControl>
      </form>
    </ContentPage>
  )
}

export default FormCourse;