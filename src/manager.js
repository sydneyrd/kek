


const key = process.env.REACT_APP_OPENAI_API_KEY



const API_KEY = process.env.REACT_APP_DUCK_KEY;
    const API_SECRET = process.env.REACT_APP_DUCK_SECRET;
    const SPEAK_API = 'https://api.uberduck.ai/speak';
    const SPEAK_STATUS_API = 'https://api.uberduck.ai/speak-status';



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
      accept: 'application/json',
      'uberduck-id': 'anond98e3de5-8b78-4706-98ae-e24058aaf97cymous',
      'content-type': 'application/json',
      authorization: 'Basic cHViX29qYnVkYWVzbGZodXdidXRjazpwa183MmY0ODljOC1jNzI0LTQ3OTItOGUzNy04OTVjYjRmY2VmYjA='
    },
    body: JSON.stringify({voicemodel_uuid: "d98e3de5-8b78-4706-98ae-e24058aaf97c", pace: 1, speech: `${input}`})
  };
  
  return fetch('https://api.uberduck.ai/speak', options)
  .then(response => response.json())
  .then(response => {
    console.log(response);
    return response; // return the UUID
  })
  .catch(err => console.error(err));
    
    
    }


    export const pollSpeakStatus = async (voiceResponse, setAudioUrl) => {
      console.log(voiceResponse);
      const response = await fetch(`${SPEAK_STATUS_API}?uuid=${voiceResponse}`, {
        headers: {
          Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
        },
      });
      const status = await response.json();
    
      if (status.finished_at) {
        // Set the audio URL in the state to be used later
        setAudioUrl(status.path);
      } else if (status.failed_at) {
        console.error('Audio generation failed.');
      } else {
        // Poll again after a short delay
        setTimeout(() => pollSpeakStatus(voiceResponse, setAudioUrl), 1000);
      }
    };
    