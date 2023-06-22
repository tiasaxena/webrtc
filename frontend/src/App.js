import React, { useEffect } from 'react';

import connectWithWebSocket from './webSocketConnection/wssConnection';

const App = () =>{
  useEffect(() => {
    connectWithWebSocket();
  }, [])
  return (
    <div className="App">
      Hello
    </div>
  );
}

export default App;
