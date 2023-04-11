import { useState, useEffect } from 'react';
import './App.css';
import { getResponse, voiceTranslate, pollSpeakStatus } from './manager';



function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [uuid, setUuid] = useState(null);



  const handleClick = async (e) => {
    e.preventDefault();
    let copy = {role: "user", content: input}    
    setMessages([...messages, copy])
    const chatresponse = await getResponse(messages);
    setResponse(chatresponse.message);
    setMessages([...messages, chatresponse.message]);
    voiceTranslate(chatresponse.message.content).then((res) => {
      setUuid(res);
      console.log(res)
      pollSpeakStatus(res.uuid, setAudioUrl);
    });
  };
  
useEffect(() => {
  const audio = new Audio(audioUrl);
    audio.play();
}, [audioUrl]);



return (
  <div className="App">

    <div className="face">
      {/* {messages.map((message) => (
          <p>{message.choices[0].message.content}</p>
        ))} */}
      {/* {response.content} */}

      (❁´◡`❁)
    </div>

    <div className="input--and--button">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={(click) => handleClick(click)}></button>
    </div>
  </div>
);
}

export default App;
