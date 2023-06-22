import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import connectWithWebSocket from './webSocketConnection/wssConnection';


import Login from './LoginPage/LoginPage';
import Dashboard from './Dashboard/Dashboard';

const App = () =>{
  useEffect(() => {
    connectWithWebSocket();
  }, [])
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
