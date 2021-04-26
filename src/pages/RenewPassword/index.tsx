import React, { FormEvent, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/global.css'
import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png'
import { useHistory, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { Auth } from 'aws-amplify';

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

interface State {
  username: string;
}

const RenewPassword = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<State>();
  const [ username, setUsername ] = useState('');
  const [ code, setCode ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  
  useEffect(() => {
    if(location.state !== undefined) {
      setUsername(location.state.username);
    }
  }, [location.state])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if(confirmPassword !== password){
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'A senha e confirmação de senha não coincidem!'
      });
      return;
    }

    if(code.length !== 6 || code.match(/\D/) !== null){
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'O código de recuperação precisa de 6 dígitos numéricos!'
      });
      return;
    }

    try {
      await Auth.forgotPasswordSubmit(username, code, password);
      history.push('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Ocorreu um erro ao tentar alterar a senha!'
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
            Recuperação de senha
          </Typography>
          <form onSubmit={handleSubmit} className={classes.formLogin}>
            <FormControl>
              <TextField 
                variant="outlined"
                label="Código"
                fullWidth
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                variant="outlined"
                label="Nova senha"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                variant="outlined"
                label="Confirmação de senha"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Button
                className={classes.button}
                type="submit"
              >
                Alterar senha
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RenewPassword;