import React from 'react';
import ContentPage from '../../components/ContentPage'
// import Card from '@material-ui/core/Card';
// import { createStyles, makeStyles, Theme } from '@material-ui/core';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     cards: {
//       display: "grid",
//       gridTemplateColumns: "repeat(3, 1fr)",  
//     }
//   })
// );

const Home = (): JSX.Element => {
  // const classes = useStyles();

  return (
    <ContentPage>
      <h2>Dashboard</h2>
      <h1
        style={{
          textAlign: 'center'
        }}
      >EM DESENVOLVIMENTO...</h1>
      {/* <div className={classes.cards}>
        <Card>
          <span>TESTE</span>
        </Card>
        <Card>
          <span>TESTE</span>
        </Card>
        <Card>
          <span>TESTE</span>
        </Card>        
      </div> */}
    </ContentPage>
  )
}

export default Home;