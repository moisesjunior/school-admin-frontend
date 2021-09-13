import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import ContentPage from '../../components/ContentPage'
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { increment, selectCount } from '../../features/counter/slice';

const Home = (): JSX.Element => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(count)
    
  }, [count])

  return (
    <ContentPage>
      <h1
        style={{
          textAlign: 'center'
        }}
      >{count.map(name => {
        console.log(count);
        return <h1>{name}</h1>
      })}</h1>
      <div
      style={{
        textAlign: 'center'
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(increment('foda-se'))}
        >Remover foda-se</Button>&nbsp;
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(decrement())}
        >DECREMENT</Button>&nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(incrementByAmount(10))}
        >INCREMENT 10</Button>&nbsp; */}
      </div>
    </ContentPage>
  )
}

export default Home;