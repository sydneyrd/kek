const key = process.env.REACT_APP_OPENAI_API_KEY
const API_KEY = process.env.REACT_APP_DUCK_KEY;
const API_SECRET = process.env.REACT_APP_DUCK_SECRET;
const cors_key = process.env.REACT_APP_CORS_KEY;

export const getResponse = async (input) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: input,
        temperature: 1.2,
        top_p: 1,
      }),
    });
    const data = await response.json();
    return data.choices[0];
    };

export const voiceTranslate = async (input) => {
  const options = {
    method: 'POST',
    headers: {
      'x-cors-api-key': 'cors_key',
      'accept': 'application/json',
      'uberduck-id': 'anond98e3de5-8b78-4706-98ae-e24058aaf97cymous',
      'content-type': 'application/json',
      'authorization': 'Basic' + btoa(API_KEY + ':' + API_SECRET)
    },
    body: JSON.stringify({voicemodel_uuid: "d98e3de5-8b78-4706-98ae-e24058aaf97c", pace: 1, speech: `${input}`})
  };
  
  return fetch('https://proxy.cors.sh/https://api.uberduck.ai/speak-synchronous', options)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(arrayBuffer, buffer => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    });
  })
  .catch(err => console.error(err));
    
    
    }

