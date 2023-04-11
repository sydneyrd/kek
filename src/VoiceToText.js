import React, { useState, useEffect } from 'react';
import './dpad.css'

export const VoiceToText = ({transcript, setTranscript, handleClickVoice}) => {
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);


  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const WebSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new WebSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
    } else {
      console.error('SpeechRecognition not supported by this browser.');
    }
  }, []);

  const startListening = () => {
    setTranscript('')
    if (recognition) {
      setListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const currentResult = event.results[event.results.length - 1];
        if (currentResult.isFinal) {
          const newTranscript = currentResult[0].transcript;
          setTranscript((prevTranscript) => prevTranscript + " " + newTranscript.trim());
        }
      };
      
    }
  };

  const stopListening = () => {
    if (recognition) {
      setListening(false);
      recognition.stop();
    }
  };

  return (
    <>
     
      

      <div class="d-pad">
  <div class="d-pad-button up"></div>
  <div class="d-pad-button right"></div>
  <div class="d-pad-button down"></div>
  <div class="d-pad-button left"></div>
  <div class="d-pad-center"></div>
</div>

<div style={{display:'flex'}}>
<div className="voice--container">

      <button className="voice--send"
      onClick={handleClickVoice}
      ><span
      className="icon--voice">▶</span></button></div>

 <button className="voice--button"
      
      onClick={listening ? stopListening : startListening}>
        {listening ? '🛑' : '🎤'}
      </button>
</div>

      </>
  );
};


