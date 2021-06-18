import React, { FormEvent, useEffect, useState } from 'react';
import ContentPage from '../../../components/ContentPage';
import { createStyles, FormControl, makeStyles, Theme, TextField, Select, MenuItem, InputLabel, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBack';
import NumberFormat from 'react-number-format';
import { Auth } from 'aws-amplify';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridGap: '10px',
      marginTop: '20px',
      gridTemplateRows: 'repeat(3, 1fr)',
      '@media screen and (max-width: 1024px) and (min-width: 700px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
      },
      '@media screen and (max-width: 699px)': {
        gridTemplateColumns: 'repeat(1, 1fr)',
      }
    },
    button: {
      '& > *': {
        margin: theme.spacing(1),
      },
      display: "block",
      gridRowStart: 3,
      gridColumnStart: 4,
      gridColumnEnd: 5,
      '@media screen and (max-width: 1024px) and (min-width: 700px)': {
        gridColumnStart: 3,
        gridColumnEnd: 4,
      },
      '@media screen and (max-width: 699px)': {
        gridRowStart: 7,
        gridColumnStart: 1,
        gridColumnEnd: 1
      }
    }
  })
)

interface State {
  id: string;
  action: 'edit' | 'view';
}

const FormExpenditure = (): JSX.Element => {
  const classes = useStyles();
  const location = useLocation<State>();
  const history = useHistory();
  const [ id, setId ] = useState('');
  const [ action, setAction ] = useState('');
  const [ dueDate, setDueDate ] = useState<Date | null>(null);
  const [ value, setValue ] = useState<Number | null>(null);
  const [ expenditureType, setExpenditureType ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ referenceDate, setReferenceDate ] = useState<Date | null>(null);
  const [ paymentDay, setPaymentDay ] = useState<Date | null>(null);

  useEffect(() => {
    if(location.state !== undefined && location.state !== null){
      setId(location.state.id);
      setAction(location.state.action);

      const result = async () => {
        const currentSession = await Auth.currentSession();
        const response = await api.get(`/expenditure/${location.state.id}`, {
          headers: {
            'CognitoIdToken': currentSession.getIdToken().getJwtToken()
          }
        });
        setDescription(response.data.description);
        setDueDate(response.data.dueDate);
        setValue(response.data.value);
        setExpenditureType(response.data.expenditureType);
        setReferenceDate(response.data.referenceDate);
        setPaymentDay(response.data.paymentDay);
      }

      result();
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const currentSession = await Auth.currentSession();
      if(id !== ''){
        await api.put(`/expenditure/${id}`,{
          description,
          dueDate,
          value,
          expenditureType,
          referenceDate,
          paymentDay
        }, {
          headers: {
            'CognitoIdToken': currentSession.getIdToken().getJwtToken()
          }
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Despesa atualizada com sucesso!',
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          showCancelButton: true,
          confirmButtonText: "Cadastrar outra!",
          cancelButtonText: "Voltar"
        }).then(result => {
          if(result.isConfirmed){
            window.location.reload(false);
          } else {
            history.push('/expenditures');
          }
        });
  
      } else {
        console.log('aqui');
        await api.post('/expenditure',{
          description,
          dueDate,
          value,
          expenditureType,
          referenceDate,
          paymentDay
        },  {
          headers: {
            'CognitoIdToken': currentSession.getIdToken().getJwtToken()
          }
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Despesa criada com sucesso!',
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          showCancelButton: true,
          confirmButtonText: "Cadastrar outra!",
          cancelButtonText: "Voltar"
        }).then(result => {
          if(result.isConfirmed){
            window.location.reload(false);
          } else {
            history.push('/expenditures');
          }
        });
      } 
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Ocorreu um erro ao salvar o curso!'
      });
    }
  }

  return (
    <ContentPage>
      <h2>Formulário de despesa</h2>
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
        <FormControl required variant="outlined">
          <InputLabel>Tipo da despesa</InputLabel>
          <Select
            disabled={action !== "view" ? false : true}
            label="Tipo da despesa"
            value={expenditureType}
            onChange={(e) => setExpenditureType(e.target.value as string)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="FIXA">Fixa</MenuItem>
            <MenuItem value="VARIÁVEL">Variável</MenuItem>
            <MenuItem value="DEISE PARTICULAR">Deise Particular</MenuItem>
            <MenuItem value="JULIO PARTICULAR">Júlio Particular</MenuItem>
            <MenuItem value="SD">SD</MenuItem>
            <MenuItem value="Identificação">Identificação</MenuItem>
            <MenuItem value="Financeira">Financeira</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Data do vencimento"
              views={['year', 'month', 'date']}
              value={dueDate}
              onChange={(value) => {
                setDueDate(value)
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
            label="Valor da despesa" 
            value={value}
            onChange={(e) => setValue(Number(e.target.value))} 
            InputProps={{
              inputComponent: NumberFormatCustom as any
            }}
          />
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Mês de referência"
              views={['year', 'month']}
              value={referenceDate}
              onChange={(value) => {
                setReferenceDate(value);
              }}
              required
              format="MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Dia do pagamento"
              views={['year', 'month', 'date']}
              value={paymentDay}
              onChange={(value) => {
                setPaymentDay(value);
              }}
              format="dd/MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className={classes.button}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<BackIcon />}
            onClick={() => { history.push('/expenditures') }}
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

export default FormExpenditure;