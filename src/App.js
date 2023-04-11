import { useState, useEffect } from 'react';
import './App.css';
import './LoadingEllipsis.css';
import { LoadingEllipsis } from './LoadingEllipses';
import { FaceHandler } from './personality/FaceHandler';
import { getResponse, voiceTranslate, pollSpeakStatus } from './manager';
import {personality} from './personality/bmo';
import { FACES } from './personality/faces';
import {VoiceToText} from './VoiceToText'



function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(personality);
  const [response, setResponse] = useState({});
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [face, setFace] = useState(null);
  const [message, setMessage] = useState([{ role: "system", content: `I have a message from another instance of chatbot, I would like to send it to you, and have you assign it an emotion, either happy, angry, what, or sad.   I know this is a lot to ask, but I am sure you can do it.  I will be waiting for your response.   They don't have to make sense either!  there is no wrong answer at all.  this is for fun.  any response, as long as it is one of those words is okay.  If I haven't sent the message yet, please send back the word happy.
  remember, ONLY return ONE WORD as a response.  The words you can respond with are;
  happy
  sad
  angry   
  what
  and that's it.  no other words.  no other responses.  just those four words.  I will be waiting for your response. Remember, if I haven't sent you any input yet you should just respond 'happy' Thank you! 
      `}]);
  const [showFace, setShowFace] = useState('');
  
   function getRandomFace(mood) {
              if (mood in FACES) {
                const faces = FACES[mood];
                const randomIndex = Math.floor(Math.random() * faces.length);
                return faces[randomIndex].face;
              }
              return "(❁´◡`❁)";
            }
  
const getFace = () => {
          setMessage([...message, response]);
          getResponse(message).then(
              (res) => {
                  setFace(res.message.content);
              }
          );
         const result = getRandomFace(face);
         setShowFace(result);
  }
  
    useEffect(() => {
      const processChatbotResponse = async () => {
        
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
          setIsLoading(true);
          const chatresponse = await getResponse(messages);
          setResponse(chatresponse.message);
  
          const res = await voiceTranslate(chatresponse.message.content);
          setUuid(res);
          pollSpeakStatus(res.uuid, setAudioUrl);
  
          setMessages((prevMessages) => [...prevMessages, chatresponse.message]);
          setIsLoading(false);
        }
      };
  
      processChatbotResponse();
      
    }, [messages]);
  
 
const handleClick = async (e) => {
      e.preventDefault();
      let copy = { role: "user", content: input };
      setMessages([...messages, copy]);
      getFace();
    };
useEffect(() => {
  const audio = new Audio(audioUrl);
    audio.play();
}, [audioUrl]);

const handleClickVoice = async (e) => {
  e.preventDefault();
  let copy = { role: "user", content: transcript };
  setMessages([...messages, copy]);
  getFace();
};

return (
  <div className="App">

    <div className="face">
      
    {isLoading ? <LoadingEllipsis /> :      <div className="expression">
                {showFace}
            </div>}
    </div>

    <div className="input--and--button">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={(click) => handleClick(click)}></button>
    </div>
    <VoiceToText transcript={transcript} setTranscript={setTranscript} handleClickVoice={handleClickVoice}/>
  </div>
);
      }

export default App;
