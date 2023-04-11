import { useState, useEffect } from 'react';
import './App.css';
import './LoadingEllipsis.css';
import { LoadingEllipsis } from './LoadingEllipses';
import { getResponse, voiceTranslate } from './manager';
import {personality, faceMessage} from './personality/bmo';
import { FACES } from './personality/faces';
import {VoiceToText} from './VoiceToText'



function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(personality);
  const [response, setResponse] = useState({});
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  // const [uuid, setUuid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [face, setFace] = useState('');
  const [message, setMessage] = useState(faceMessage);
  const [showFace, setShowFace] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
function getRandomFace(mood) {
              if (mood in FACES) {
                const faces = FACES[mood];
                const randomIndex = Math.floor(Math.random() * faces.length);
                return faces[randomIndex].face;
              }
              return "(´◡`)";
            }
  
const getFace = (inputMessage) => {
  if (inputMessage.content !== ""){
          setMessage([...message, input]);
          getResponse(message).then(
              (res) => {
                console.log(res.message.content);
                  setFace(res.message.content);
                  console.log(face);
              }
          );
         const result = getRandomFace(face);
         setShowFace(result);}
  }
  const stopListening = () => {
    if (recognition) {
      setListening(false);
      recognition.stop();
    }
  };
    useEffect(() => {
      const processChatbotResponse = async () => {
        
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
          setIsLoading(true);
          const chatresponse = await getResponse(messages);
          setResponse(chatresponse.message);
  
          const res = await voiceTranslate(chatresponse.message.content);
          // setUuid(res);
          // pollSpeakStatus(res.uuid, setAudioUrl);
  
          setMessages((prevMessages) => [...prevMessages, chatresponse.message]);
          setIsLoading(false);
        }
      };
  
      processChatbotResponse();
      
    }, [messages]);
  
 
const handleClick = async (e) => {
      e.preventDefault();
      stopListening();
      let copy = {}
      if (input != ""){copy = { role: "user", content: input }}
      else {copy = { role: "user", content: transcript }}
      setMessages([...messages, copy]);
      getFace(response);
      setInput('');
      setTranscript('');
    };

useEffect(() => {
  const audio = new Audio(audioUrl);
    audio.play();
}, [audioUrl]);

// const handleClickVoice = async (e) => {
//   e.preventDefault();
//   let copy = { role: "user", content: transcript };
//   setMessages([...messages, copy]);
//   getFace(response);
//   setTranscript('')
// };

return (
  <div className="App">

    <div className="face">
      
    {isLoading ? <LoadingEllipsis /> :      <div className="expression">
                {showFace}
            </div>}
    </div>

    <div className="input--and--button">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button className='send--text' onClick={(click) => handleClick(click)}>▶</button>
    </div>
    <div className="buttons--container">
    <VoiceToText stopListening={stopListening} recognition={recognition} setRecognition={setRecognition} setTranscript={setTranscript}  listening={listening} setListening={setListening}/>
  </div></div>
);
      }

export default App;
