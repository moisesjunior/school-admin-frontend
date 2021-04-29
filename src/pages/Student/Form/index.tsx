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

interface State {
  id: string;
  action: 'edit' | 'view';
}

interface Course {
  id: string;
  description: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({   
    personalInfo: {
      display: 'grid'
    },
    addressInfo: {
      display: 'grid'
    },
    familyInfo: {
      display: 'grid'
    },
    medicalInfo: {
      display: 'grid'
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
  const [ rg, setRg ] = useState('');
  const [ emitter, setEmitter ] = useState('');
  const [ emissionDate, setEmissionDate ] = useState<Date | null>(null);
  const [ voterRegistration, setVoterRegistration ] = useState('');
  const [ reservist, setReservist ] = useState(false);
  const [ highSchool, setHighSchool ] = useState(false);
  const [ whichSchool, setWhichSchool ] = useState('');
  const [ whichYear, setWhichYear ] = useState('');
  const [ whichCity, setWhichCity ] = useState('');
  const [ course, setCourse ] = useState('');

  // Endereço
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

  // Informações médicas
  const [ chronicDisease, setChronicDisease ] = useState(false);
  const [ hepatitis, setHepatitis ] = useState(false);
  const [ useMedication, setUseMedication ] = useState(false);
  const [ whichMedication, setWhichMedication ] = useState('');

  useEffect(() => {
    const result = async () => {
      const responseCourses = await api.get('/course');
      setCourses(responseCourses.data);

      if(location.state !== undefined && location.state !== null){
        setId(location.state.id);
        setAction(location.state.action);

        const response = await api.get(`/customer/${location.state.id}`);
        setName(response.data.name)
        setCpf(response.data.cpf)
        setEmail(response.data.email)
        setPhoneNumber(response.data.phoneNumber)
        setMobilePhone(response.data.mobilePhone)
        setBirthdate(response.data.birthdate)
        setNationality(response.data.nationality)
        setMaritalStatus(response.data.maritalStatus)
        setRg(response.data.rg)
        setEmitter(response.data.emitter)
        setEmissionDate(response.data.emissionDate)
        setVoterRegistration(response.data.voterRegistration)
        setReservist(Boolean(response.data.reservist))
        setHighSchool(response.data.highSchool)
        setWhichSchool(response.data.whichSchool)
        setWhichYear(response.data.whichYear)
        setWhichCity(response.data.whichCity)
        setCourse(response.data.course.id)
        setAddress(response.data.address)
        setAddressNumber(Number(response.data.addressNumber));
        setComplement(response.data.complement)
        setProvince(response.data.province)
        setCity(response.data.city)
        setState(response.data.state)
        setPostalCode(response.data.postalCode)
        setFatherName(response.data.fatherName)
        setMotherName(response.data.motherName)
        setChronicDisease(response.data.chronicDisease)
        setHepatitis(response.data.hepatitis)
        setUseMedication(response.data.useMedication)
        setWhichMedication(response.data.whichMedication)
      }
    }

    result();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      if(id !== ''){
        await api.put(`/customer/${id}`,{
          name, cpf, email, phoneNumber, mobilePhone,
          birthdate, nationality, maritalStatus, address, addressNumber,
          complement, province, city, state, postalCode,
          rg, emitter, emissionDate, voterRegistration, reservist,
          fatherName, motherName, highSchool, whichSchool, whichYear,
          whichCity, chronicDisease, hepatitis, useMedication, whichMedication, course
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
          name, cpf, email, phoneNumber, mobilePhone,
          birthdate, nationality, maritalStatus, address, addressNumber,
          complement, province, city, state, postalCode,
          rg, emitter, emissionDate, voterRegistration, reservist,
          fatherName, motherName, highSchool, whichSchool, whichYear,
          whichCity, chronicDisease, hepatitis, useMedication, whichMedication, course
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
        title: 'Atenção',
        text: 'Ocorreu um erro ao salvar o cliente!'
      });
    }
  }

  return (
    <ContentPage>
      <h2>Formulário - Aluno</h2>
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
              value={cpf}
              onChange={(e) => setCpf(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              variant="outlined" 
              type="email"
              required
              label="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              required 
              variant="outlined" 
              label="Celular" 
              value={mobilePhone}
              onChange={(e) => setMobilePhone(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <TextField 
              disabled={action !== "view" ? false : true}
              variant="outlined" 
              label="Telefone" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} 
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
            <MenuItem value="VIÚVO">Viúvo(a)</MenuItem>
            <MenuItem value="SEPARADO JUDICIALMENTE">Separado(a) Judicialmente</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="RG" 
            value={rg}
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
              label="Data de emissão"
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
            label="Título de eleitor" 
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
              name="checkedA" 
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
              name="checkedA" 
            />
          }
          label="Finalizou ensino médio?"
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
        <FormControl required variant="outlined">
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
        </div>
        <div className={classes.span}>
          <span>Endereço</span>
        </div>
        <div className={classes.addressInfo}>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            required
            variant="outlined" 
            label="CEP" 
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            required
            label="Rua" 
            value={address}
            onChange={(e) => setAddress(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            label="Número" 
            required
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
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            required
            label="Bairro" 
            value={province}
            onChange={(e) => setProvince(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            required
            label="Cidade" 
            value={city}
            onChange={(e) => setCity(e.target.value)} 
          />
        </FormControl>
        <FormControl>
          <TextField 
            disabled={action !== "view" ? false : true}
            variant="outlined" 
            required
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
              label="Nome completo do mãe" 
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)} 
            />
          </FormControl>
        </div>
        <div className={classes.span}>
          <span>Informações médicas</span>
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
            label="Tem alguma doença crônica?"
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
              label="Qual remédio?" 
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