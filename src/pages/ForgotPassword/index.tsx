import React, { FormEvent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/global.css'
import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png'
import { useHistory } from 'react-router';
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
    left: "50%",
    right: "5%",
    position: "absolute",
    textAlign: "center"
  },
  formLogin: {
    display: "grid",
    gridGap: "20px"
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

const ForgotPassword = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [ username, setUsername ] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await Auth.forgotPassword(username);
      history.push({
        pathname: '/renewPassword',
        state: {
          username
        }
      }); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Ocorreu um erro ao solicitar o reset de senha.'
      })
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
            Esqueceu sua senha?
          </Typography>
          <Typography 
            variant="h5"
            style={{
              marginTop: "10%"
            }} 
            gutterBottom
          >
            Insira o nome de usuário que você usa para acessar a sua conta, nós enviaremos as instruções para alterar a sua senha. 
          </Typography>
          <form onSubmit={handleSubmit} className={classes.formLogin}>
            <FormControl>
              <TextField 
                variant="outlined"
                label="Usuário"
                fullWidth
                style={{
                  marginTop: "10%"
                }} 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Button
                className={classes.button}
                type="submit"
              >
                Enviar código
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;