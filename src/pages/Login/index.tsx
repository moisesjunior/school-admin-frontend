import React, { FormEvent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/global.css'
import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png'
import { useHistory } from 'react-router';
import { UIStore } from '../../services/Store';
import { Auth } from 'aws-amplify';
import Swal from 'sweetalert2';

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
    marginTop: "20%"
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

const Login = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const user = await Auth.signIn(username, password);

      if(user.challengeName === 'NEW_PASSWORD_REQUIRED'){
        history.push({
          pathname: "nova-senha",
          state: {
            username,
            password
          }
        })
      } else {
        UIStore.update(s => {
          s.signed = true
        });
        localStorage.setItem('signed', 'true');
    
        const expirationTime = new Date().setHours(new Date().getHours() + 8);
        localStorage.setItem('expirationTime', String(expirationTime));
    
        history.push('/home');
      }
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
            Bem-vindo
          </Typography>
          <form onSubmit={handleSubmit} className={classes.formLogin}>
            <FormControl>
              <TextField 
                type="text"
                variant="outlined"
                label="Usuário"
                required
                fullWidth
                onChange={(event) => setUsername(event.target.value)}
                value={username}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                variant="outlined"
                label="Senha"
                required
                fullWidth
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </FormControl>
            <FormControl>
              <Button
                className={classes.button}
                type="submit"
              >
                Login
              </Button>
            </FormControl>
            <FormControl>
              <Button
                className={classes.button}
                onClick={() => {history.push('/forgotPassword')}}
              >
                Esqueci minha senha
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;