import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import ContentPage from '../../../components/ContentPage';
import { Button, createStyles, Checkbox, FormControlLabel, FormControl, makeStyles, Theme, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import api from '../../../services/api';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBack';

interface Discount {
  value: number
  dueDateLimitDays: number,
  type: string;
}

interface Interest {
  value: number;
}

interface Fine {
  value: number;
}

interface State {
  id: string;
  action: 'edit' | 'view';
}

interface Customer {
  id: string;
  name: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridGap: '10px',
      marginTop: '20px',
      gridTemplateRows: 'repeat(2, 1fr)',
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
      gridColumnStart: 3,
      gridColumnEnd: 4,
      '@media screen and (max-width: 1024px) and (min-width: 700px)': {
        gridColumnStart: 1,
        gridColumnEnd: 3,
      },
      '@media screen and (max-width: 699px)': {
        gridRowStart: 7,
        gridColumnStart: 1,
        gridColumnEnd: 1
      }
    }
  })
);

const FormPayment = (): JSX.Element => {
  const location = useLocation<State>();
  const history = useHistory();
  const classes = useStyles();
  const [ customers, setCustomers ] = useState([]);

  const [ id, setId ] = useState('');
  const [ action, setAction ] = useState('');
  const [ customer, setCustomer ] = useState<string | null>(null);
  const [ generateAssasPayment, setGenerateAssasPayment] = useState(false);
  const [ type, setType ] = useState('');
  const [ status, setStatus ] = useState('PENDING');
  const [ billingType, setBillingType ] = useState('Boleto');
  const [ value, setValue ] = useState(0);
  const [ dueDateFormat, setDueDateFormat ] = useState<Date | null>(null);
  const [ description, setDescription ] = useState('');
  const [ discount, setDiscount ] = useState<Discount>({
    value: 20,
    dueDateLimitDays: 5,
    type: "FIXED"
  });
  const [ interest, setInterest ] = useState<Interest>({
    value: 0.13
  });
  const [ fine, setFine ] = useState<Fine>({
    value: 10
  });

  useEffect(() => {
    const result = async () => {
      const response = await api.get('customer');

      setCustomers(response.data);

      if(location.state !== undefined && location.state !== null){
        setId(location.state.id);
        setAction(location.state.action);
        const response = await api.get(`/payment/${location.state.id}`);
        console.log(response.data)
        setDescription(response.data.description);
        setDueDateFormat(new Date(response.data.dueDate));
        setValue(Number(response.data.value));
        setGenerateAssasPayment(response.data.generateAssasPayment);
        setType(response.data.type);
        setStatus(response.data.status);
        setBillingType(response.data.billingType);
        setDiscount(response.data.discount);
        setInterest(response.data.interest);
        setFine(response.data.fine);
        if(response.data.customer !== null){
          setCustomer(response.data.customer.id);
        }
      }
    }

    result();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const dueDate = dueDateFormat?.toISOString().split('T')[0];

    try {
      if(id !== ''){
        await api.put(`/payment/${id}`,{
          customer,
          generateAssasPayment,
          dueDate,
          description,
          type,
          value,
          status,
          billingType,
          discount,
          interest,
          fine
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Pagamento atualizado com sucesso!',
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
            history.push('/payments');
          }
        });
  
      } else {
        await api.post('/payment',{
          customer,
          dueDate,
          description,
          generateAssasPayment,
          type,
          value,
          status,
          billingType,
          discount,
          interest,
          fine
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Pagamento criado com sucesso!',
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
            history.push('/payments');
          }
        });
      } 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Ocorreu um erro ao salvar o pagamento!'
      });
    }
  }

  return (
    <ContentPage>
      <h2>Formulário - Pagamento</h2>
      <form className={classes.form} onSubmit={handleSubmit}>
        <FormControl variant="outlined">
          <InputLabel>Cliente</InputLabel>
          <Select
            disabled={action !== "view" ? false : true}
            label="Curso"
            value={customer}
            required={generateAssasPayment ? true : false}
            onChange={(e) => setCustomer(e.target.value as string)}
          >
            { customers.map((customer: Customer) => (
              <MenuItem value={customer.id}>{customer.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disablePast
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              required
              label="Data de vencimento"
              views={['year', 'month', 'date']}
              value={dueDateFormat}
              onChange={(value) => {
                console.log(value?.toLocaleString())
                setDueDateFormat(value)
              }}
              format="dd/MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true} 
            variant="outlined" 
            required
            label="Descrição" 
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
        </FormControl>
        <FormControl
          variant="outlined"
          required
        >
          <InputLabel>Tipo do pagamento</InputLabel>
          <Select
            disabled={action !== "view" ? false : true}
            value={type}
            onChange={(e) => setType(e.target.value as string)}
          >
            <MenuItem value="Mensalidade">Mensalidade</MenuItem>
            <MenuItem value="Dependẽncia">Dependência</MenuItem>
            <MenuItem value="Matrícula">Matrícula</MenuItem>
            <MenuItem value="Falta (Estágio)">Falta (Estágio)</MenuItem>
            <MenuItem value="Outros">Outros</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true} 
            variant="outlined" 
            required
            label="Valor" 
            value={value}
            onChange={(e) => setValue(Number(e.target.value))} 
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox 
              disabled={action !== "view" ? false : true}
              color="primary" 
              checked={generateAssasPayment}
              onChange={(e) => setGenerateAssasPayment(e.target.checked)}
              name="checkedA" 
            />
          }
          label="Gerar uma cobrança no ASAAS"
        />
        <FormControl className={classes.button}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<BackIcon />}
            onClick={() => { history.push('/payments') }}
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
            style={{
              marginLeft: "10px"
            }}
          >
            Salvar
          </Button>
        </FormControl>
      </form>
    </ContentPage>
  )
}

export default FormPayment;