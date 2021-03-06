import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ContentPage from '../../../components/ContentPage';
import api from '../../../services/api';
import { Button, Checkbox, FormControlLabel, createStyles, FormControl, makeStyles, TextField, Theme, InputLabel, Select, MenuItem} from '@material-ui/core';
import Swal from 'sweetalert2';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBack';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Auth } from 'aws-amplify';
import { maskCPF, maskPhoneNumber, maskCEP } from '../../../utils/mask';
import { cpf as cpfvalidator } from 'cpf-cnpj-validator';
import axios from 'axios';
import NumberFormat from 'react-number-format';

interface State {
  id: string;
  action: 'edit' | 'view';
}

interface Course {
  id: string;
  description: string;
}

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
      decimalScale={2}
    />
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({   
    personalInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: '10px',
      '@media screen and (max-width: 900px)': {
        gridTemplateColumns: 'repeat(1, 1fr)',
      }
    },
    addressInfo: {
      gridGap: '10px',
      gridTemplateColumns: 'repeat(4, 1fr)',
      display: 'grid',
      '@media screen and (max-width: 900px)': {
        gridTemplateColumns: 'repeat(1, 1fr)',
      }
    },
    familyInfo: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridGap: '10px',
      display: 'grid',
      '@media screen and (max-width: 900px)': {
        gridTemplateColumns: 'repeat(1, 1fr)',
      }
    },
    medicalInfo: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: '10px',
      display: 'grid',
      '@media screen and (max-width: 900px)': {
        gridTemplateColumns: 'repeat(1, 1fr)',
      }
    },
    span: {
      padding: "15px",
      color: "#FFFFFF",
      backgroundColor: "#FF8066",
      borderRadius: "10px",
      margin: "15px 0px 15px 0px",
      '@media screen and (max-width: 991px)': {
        margin: "15px 0 15px 0",
      }
    },
    button:{
      marginTop: "10px",
      display: 'block',
    }
  })
)

const FormStudent = (): JSX.Element => {
  const classes = useStyles();
  const location = useLocation<State>();
  const history = useHistory();
  const [ courses, setCourses ] = useState([]);
  const [ id, setId ] = useState('');
  const [ action, setAction ] = useState('');

  // Dados pessoais
  const [ name, setName ] = useState('');
  const [ cpf, setCpf ] = useState('');
  const [ email, setEmail] = useState('');
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ mobilePhone, setMobilePhone ] = useState('');
  const [ birthdate, setBirthdate ] = useState<Date | null>(null);
  const [ nationality, setNationality ] = useState('');
  const [ maritalStatus, setMaritalStatus ] = useState('');
  const [ rg, setRg ] = useState<string | null>(null);
  const [ emitter, setEmitter ] = useState('');
  const [ emissionDate, setEmissionDate ] = useState<Date | null>(null);
  const [ voterRegistration, setVoterRegistration ] = useState('');
  const [ reservist, setReservist ] = useState(false);
  const [ highSchool, setHighSchool ] = useState(false);
  const [ whichSchool, setWhichSchool ] = useState('');
  const [ whichYear, setWhichYear ] = useState('');
  const [ whichCity, setWhichCity ] = useState('');
  const [ payment, setPayment ] = useState(0);
  const [ course, setCourse ] = useState<string | null>('');

  // Endere??o
  const [ address, setAddress ] = useState('');
  const [ addressNumber, setAddressNumber ] = useState(0);
  const [ complement, setComplement ] = useState('');
  const [ province, setProvince ] = useState('');
  const [ city, setCity ] = useState('');
  const [ state, setState ] = useState('');
  const [ postalCode, setPostalCode ] = useState('');

  // Parentesco
  const [ fatherName, setFatherName ] = useState('');
  const [ motherName, setMotherName ] = useState('');

  // Informa????es m??dicas
  const [ chronicDisease, setChronicDisease ] = useState(false);
  const [ hepatitis, setHepatitis ] = useState(false);
  const [ useMedication, setUseMedication ] = useState(false);
  const [ whichMedication, setWhichMedication ] = useState('');

  useEffect(() => {
    const result = async () => {
      const currentSession = await Auth.currentSession();
      const responseCourses = await api.get('/course', {
        headers: {
          'CognitoIdToken': currentSession.getIdToken().getJwtToken()
        }
      });
      setCourses(responseCourses.data);

      if(location.state !== undefined && location.state !== null){
        setId(location.state.id);
        setAction(location.state.action);

        const response = await api.get(`/customer/${location.state.id}`, {
          headers: {
            'CognitoIdToken': currentSession.getIdToken().getJwtToken()
          }
        });
        setName(response.data.name);
        setCpf(response.data.cpf);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setMobilePhone(response.data.mobilePhone);
        setBirthdate(response.data.birthdate);
        setNationality(response.data.nationality);
        setMaritalStatus(response.data.maritalStatus);
        setRg(response.data.rg);
        setEmitter(response.data.emitter);
        setEmissionDate(response.data.emissionDate);
        setVoterRegistration(response.data.voterRegistration);
        setReservist(response.data.reservist);
        setHighSchool(response.data.highSchool);
        setWhichSchool(response.data.whichSchool);
        setWhichYear(response.data.whichYear);
        setWhichCity(response.data.whichCity);
        if(response.data.course !== null){
          setCourse(response.data.course.id);
        }
        setAddress(response.data.address);
        setAddressNumber(Number(response.data.addressNumber));
        setComplement(response.data.complement);
        setProvince(response.data.province);
        setCity(response.data.city);
        setState(response.data.state);
        setPostalCode(response.data.postalCode);
        setFatherName(response.data.fatherName);
        setMotherName(response.data.motherName);
        setChronicDisease(response.data.chronicDisease);
        setHepatitis(response.data.hepatitis);
        setUseMedication(response.data.useMedication);
        setWhichMedication(response.data.whichMedication);
        setPayment(Number(response.data.payment));
      }
    }

    result();
  }, [location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if(cpf !== null && !cpfvalidator.isValid(cpf.replace(/\D/g, ''))){
      Swal.fire({
        icon: 'error',
        title: 'Aten????o!',
        text: 'CPF ?? inv??lido!'
      });

      return;
    }

    try {
      const currentSession = await Auth.currentSession();
      if(id !== ''){
        await api.put(`/customer/${id}`,{
          name, cpf: ( cpf !== null ? cpf.replace(/\D/g, '') : null), email, phoneNumber: (phoneNumber !== null ? phoneNumber.replace(/\D/g, '') : null), 
          mobilePhone: ( mobilePhone !== null ? mobilePhone.replace(/\D/g, '') : null),
          birthdate, nationality, maritalStatus, address, addressNumber,
          complement, province, city, state, postalCode,
          rg, emitter, emissionDate, voterRegistration, reservist,
          fatherName, motherName, highSchool, whichSchool, whichYear,
          whichCity, chronicDisease, hepatitis, useMedication, whichMedication, payment, course: (course === '' ? null : course)
        }, {
          headers: {
            'CognitoIdToken': currentSession.getIdToken().getJwtToken()
          }
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Cliente atualizado com sucesso!',
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
            history.push('/students');
          }
        });
  
      } else {
        await api.post('/customer',{
          name, cpf: ( cpf !== null ? cpf.replace(/\D/g, '') : null), email, phoneNumber: (phoneNumber !== null ? phoneNumber.replace(/\D/g, '') : null), 
          mobilePhone: ( mobilePhone !== null ? mobilePhone.replace(/\D/g, '') : null),
          birthdate, nationality, maritalStatus, address, addressNumber,
          complement, province, city, state, postalCode,
          rg, emitter, emissionDate, voterRegistration, reservist,
          fatherName, motherName, highSchool, whichSchool, whichYear,
          whichCity, chronicDisease, hepatitis, useMedication, whichMedication, payment, course: (course === '' ? null : course)
        }, {
          headers: {
            'CognitoIdToken': currentSession.getIdToken().getJwtToken()
          }
        });
  
        Swal.fire({
          icon:'success',
          title: 'Sucesso!',
          text: 'Cliente criado com sucesso!',
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
            history.push('/students');
          }
        });
      } 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: error.response.data.title,
        text: error.response.data.message
      });
    }
  }

  const handleChangeCEP = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPostalCode(maskCEP(e.target.value));

    if(e.target.value.replace(/\D/g, '').length === 8){
      const response = await axios.get(`https://viacep.com.br/ws/${e.target.value.replace(/\D/g, '')}/json/`);
      console.log(response.data);
      setAddress(response.data.logradouro);
      setProvince(response.data.bairro);
      setCity(response.data.localidade);
      setState(response.data.uf);
    } else {
      setAddress("");
      setProvince("");
      setCity("");
      setState("");
    }
  }

  return (
    <ContentPage>
      <h2>Formul??rio - Aluno</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.span}>
          <span>Dados Pessoais</span>
        </div>
        <div className={classes.personalInfo}>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              required 
              variant="outlined" 
              label="Nome completo" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              required 
              variant="outlined" 
              label="CPF" 
              value={cpf !== null ? maskCPF(cpf) : null}
              onChange={(e) => setCpf(maskCPF(e.target.value))} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              variant="outlined" 
              type="email"
              label="Email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              variant="outlined" 
              label="Celular" 
              required
              value={mobilePhone !== null ? maskPhoneNumber(mobilePhone) : null}
              onChange={(e) => setMobilePhone(maskPhoneNumber(e.target.value))} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              variant="outlined" 
              label="Telefone" 
              value={phoneNumber !== null ? maskPhoneNumber(phoneNumber) : null}
              onChange={(e) => setPhoneNumber(maskPhoneNumber(e.target.value))}
            />
          </FormControl>
          <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Data de nascimento"
              views={['year', 'month', 'date']}
              value={birthdate}
              onChange={(value) => {
                setBirthdate(value)
              }}
              format="dd/MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="Nacionalidade" 
            value={nationality}
            onChange={(e) => setNationality(e.target.value)} 
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Estado Civil</InputLabel>
          <Select
            disabled={action !== "view" ? false : true}
            label="Estado Civil"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value as string)}
          >
            <MenuItem value="SOLTEIRO">Solteiro(a)</MenuItem>
            <MenuItem value="CASADO">Casado(a)</MenuItem>
            <MenuItem value="DIVORCIADO">Divorciado(a)</MenuItem>
            <MenuItem value="VI??VO">Vi??vo(a)</MenuItem>
            <MenuItem value="SEPARADO JUDICIALMENTE">Separado(a) Judicialmente</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="RG" 
            value={rg !== null && rg !== '' ? rg : null}
            onChange={(e) => setRg(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="Emissor" 
            value={emitter}
            onChange={(e) => setEmitter(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disabled={action !== "view" ? false : true}
              inputVariant="outlined"
              openTo="year"
              label="Data de emiss??o"
              views={['year', 'month', 'date']}
              value={emissionDate}
              onChange={(value) => {
                setEmissionDate(value)
              }}
              format="dd/MM/yyyy"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="T??tulo de eleitor" 
            value={voterRegistration}
            onChange={(e) => setVoterRegistration(e.target.value)} 
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              disabled={action !== "view" ? false : true}
              color="primary" 
              checked={reservist} 
              onChange={(e) => setReservist(e.target.checked)} 
            />
          }
          label="Reservista?"
        />
        <FormControlLabel
          control={
            <Checkbox 
              disabled={action !== "view" ? false : true}
              color="primary"
              checked={highSchool}
              onChange={(e) => setHighSchool(e.target.checked)}
            />
          }
          label="Finalizou ensino m??dio?"
        />
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : (highSchool ? false : true)}
            variant="outlined" 
            label="Em qual escola?" 
            value={whichSchool}
            onChange={(e) => setWhichSchool(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : (highSchool ? false : true)}
            variant="outlined" 
            label="Em qual ano?" 
            value={whichYear}
            onChange={(e) => setWhichYear(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : (highSchool ? false : true)}
            variant="outlined" 
            label="Em qual cidade?" 
            value={whichCity}
            onChange={(e) => setWhichCity(e.target.value)} 
          />
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Curso</InputLabel>
          <Select
            disabled={action !== "view" ? false : true}
            label="Curso"
            value={course}
            onChange={(e) => setCourse(e.target.value as string)}
          >
            { courses.map((course: Course) => (
              <MenuItem value={course.id}>{course.description}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true} 
            variant="outlined" 
            InputProps={{
              inputComponent: NumberFormatCustom as any,
            }}
            label="Valor da mensalidade" 
            value={payment}
            onChange={(e) => setPayment(parseFloat(e.target.value))} 
          />
        </FormControl>
        </div>
        <div className={classes.span}>
          <span>Endere??o</span>
        </div>
        <div className={classes.addressInfo}>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="CEP" 
            value={postalCode !== null ? maskCEP(postalCode) : null}
            onChange={(e) => handleChangeCEP(e)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : postalCode !== '' ? true : false}
            variant="outlined" 
            label="Rua" 
            value={address}
            onChange={(e) => setAddress(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="N??mero" 
            value={addressNumber}
            onChange={(e) => setAddressNumber(Number(e.target.value))} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="Complemento" 
            value={complement}
            onChange={(e) => setComplement(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : postalCode !== '' ? true : false}
            variant="outlined" 
            label="Bairro" 
            value={province}
            onChange={(e) => setProvince(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : postalCode !== '' ? true : false}
            variant="outlined" 
            label="Cidade" 
            value={city}
            onChange={(e) => setCity(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action === "view" ? true : postalCode !== '' ? true : false}
            variant="outlined" 
            label="Estado" 
            value={state}
            onChange={(e) => setState(e.target.value)} 
          />
        </FormControl>
        </div>
        <div className={classes.span}>
          <span>Parentesco</span>
        </div>
        <div className={classes.familyInfo}>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              variant="outlined" 
              label="Nome completo do pai" 
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true} 
              variant="outlined" 
              label="Nome completo do m??e" 
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)} 
            />
          </FormControl>
        </div>
        <div className={classes.span}>
          <span>Informa????es m??dicas</span>
        </div>
        <div className={classes.medicalInfo}>
          <FormControlLabel
            control={
              <Checkbox 
                disabled={action !== "view" ? false : true}
                color="primary" 
                checked={chronicDisease}
                onChange={(e) => setChronicDisease(e.target.checked)}
                name="checkedA" 
              />
            }
            label="Tem alguma doen??a cr??nica?"
          />
          <FormControlLabel
            control={
              <Checkbox 
                disabled={action !== "view" ? false : true}
                color="primary"
                checked={hepatitis}
                onChange={(e) => setHepatitis(e.target.checked)} 
                name="checkedA" 
              />
            }
            label="Tem hepatite?"
          />
          <FormControlLabel
            control={
              <Checkbox 
                disabled={action !== "view" ? false : true}
                color="primary"
                checked={useMedication}
                onChange={(e) => setUseMedication(e.target.checked)} 
                name="checkedA"
              />
            }
            label="Usa medicamento?"
          />
          <FormControl>
            <TextField 
              disabled={action === "view" ? true : (useMedication ? false : true)}
              variant="outlined" 
              label="Qual rem??dio?" 
              value={whichMedication}
              onChange={(e) => setWhichMedication(e.target.value)} 
            />
          </FormControl>
        </div>
        <FormControl className={classes.button}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<BackIcon />}
            onClick={() => { history.push('/students') }}
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

export default FormStudent;