import React, { useState, useEffect } from 'react';

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
      <button className="voice--button"
      
      onClick={listening ? stopListening : startListening}>
        {listening ? '🛑' : '🎤'}
      </button>
      <p>{transcript}</p>
      <button className="voice--send"
      onClick={handleClickVoice}
      >send voice</button>
      {console.log(transcript)}</>
  );
};


