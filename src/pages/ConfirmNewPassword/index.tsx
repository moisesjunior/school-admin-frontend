import React, { FormEvent, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/global.css'
import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png'
import { useHistory } from 'react-router';
import { UIStore } from '../../services/Store';
import { Auth } from 'aws-amplify';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '40% 60%',
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  border: {
    width: "300px",
    height: "300px",
    margin: 0,
    backgroundColor: "#fff",
    position: "absolute",
    left: "20%",
    top: "50%",
    marginRight: "-50%",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
  },
  logo: {
    width: "250px",
    height: "250px",
    marginTop: "9%",
    marginLeft: "9%"
  },
  login: {
    top: "15%",
    left: "55%",
    position: "absolute",
    textAlign: "center"
  },
  formLogin: {
    width: "500px",
    display: "grid",
    gridGap: "20px",
    marginTop: "10%"
  },
  button: {
    backgroundColor: "#FF8066",
    color: "#FFF",
    padding: "10px",
    "&:hover": {
      backgroundColor: "#C4C4C4",
    }
  }
}));

const translate = (text: string): string => {
  const messages: { [key: string]: string } = {
    "Incorrect username or password.": "Usuário ou senha incorretos."
  };

  return messages[text];
}

interface State {
  username: string;
  password: string;
}

const ConfirmNewPassword = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<State>();
  const [ username, setUsername ] = useState('');
  const [ oldPassword, setOldPassword ] = useState('');
  const [ name, setName ] = useState('');
  const [ familyName, setFamilyName ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');

  useEffect(() => {
    if(location.state !== undefined){
      setUsername(location.state.username);
      setOldPassword(location.state.password);
    }
  }, [location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if(password !== newPassword){
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'A senha e confirmação de senha não coincidem.'
      })
    }

    try {
      const user = await Auth.signIn(username, oldPassword);

      await Auth.completeNewPassword(user, password, {
        name,
        family_name: familyName
      });

      UIStore.update(s => {
        s.signed = true
      });
      localStorage.setItem('signed', 'true');
  
      const expirationTime = new Date().setHours(new Date().getHours() + 8);
      localStorage.setItem('expirationTime', String(expirationTime));
  
      history.push('/home');
    } catch (error) {      
      Swal.fire({
        icon: "error",
        title: "Atenção!",
        text: translate(error.message)
      });
    }
  }

  return (
    <div className={classes.root}>
      <div className="v-height" style={{
        backgroundColor: "#FF8066"
      }}>
        <div className={classes.border}>
          <img className={classes.logo} src={logo} alt=""/>
        </div>
      </div>
      <div className="v-height">
        <div className={classes.login}>
          <Typography variant="h3" component="h3" gutterBottom>
            Nova senha
          </Typography>
          <form onSubmit={handleSubmit} className={classes.formLogin}>
            <FormControl>
              <TextField 
                type="text"
                variant="outlined"
                label="Nome"
                required
                fullWidth
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </FormControl>
            <FormControl>
              <TextField 
                type="text"
                variant="outlined"
                label="Sobrenome"
                required
                fullWidth
                onChange={(event) => setFamilyName(event.target.value)}
                value={familyName}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                variant="outlined"
                label="Nova senha"
                required
                fullWidth
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                variant="outlined"
                label="Confirmação de senha"
                required
                fullWidth
                onChange={(event) => setNewPassword(event.target.value)}
                value={newPassword}
              />
            </FormControl>
            <FormControl>
              <Button
                className={classes.button}
                type="submit"
              >
                Salvar
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConfirmNewPassword;