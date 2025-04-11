const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3003;

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://servicio-analiticas:3000/analiticas/stats');
    const conteos = response.data;

    let html = '<h1>Estadísticas por Cliente</h1><ul>';
    for (const cliente in conteos) {
      html += `<li>${cliente}: ${conteos[cliente]}</li>`;
    }
    html += '</ul>';
    res.send(html);
  } catch (error) {
    res.send('Error al obtener estadísticas');
  }
});


app.listen(PORT, () => {
  console.log(`Panel visual disponible en http://localhost:${PORT}`);
});

