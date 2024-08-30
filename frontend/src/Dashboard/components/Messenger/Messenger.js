import React, { useState, useEffect } from "react";

import './Messenger.css';
import MessageDisplayer from "./MessageDisplayer";
import { sendMessageUsingDataChannel } from "../../../utils/webRTCHandler/webRTCHandler";

const Messenger = ({ message, setDirectCallMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleOnKeyDownEvent = (event) => {
    if(event.keyCode === 13) {
        sendMessageUsingDataChannel(inputValue);
        setInputValue('');
    }
  };

//   After displaying the message, we have to set the message in the store as empty for displaying the new message
  useEffect(() => {
    if(message.received) {
        setTimeout(() => {
            setDirectCallMessage(false, '');
        }, [3000])
    }
  }, [message.received, setDirectCallMessage])

  return (
    <>
      <input
        type="text"
        className="messages_input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleOnKeyDownEvent}
        placeholder="Type your message"
      />
      {
        message.received && <MessageDisplayer message={message.content} /> 
      }
    </>
  );
};

export default Messenger;
