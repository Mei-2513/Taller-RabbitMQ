const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const CLIENT_ID = process.env.CLIENT_ID || 'unknown-cliente';


const sendRequest = async () => {
  try {
    const response = await axios.post('http://servicio-analiticas:3000/analiticas', {}, {
      headers: { 'X-Service-ID': CLIENT_ID },
      auth: { username: 'admin', password: 'password' }
    });
    console.log(`Response from servicio-analiticas: ${response.data}`);
  } catch (error) {
    console.error(`Error sending request: ${error.message}`);
  }
};


sendRequest();
setInterval(sendRequest, 10000);

app.get('/', (req, res) => {
  res.send(`servicio cliente instance ${CLIENT_ID} is running.`);
});

app.listen(PORT, () => {
  console.log(`servicio cliente ${CLIENT_ID} listening on port ${PORT}`);
});
