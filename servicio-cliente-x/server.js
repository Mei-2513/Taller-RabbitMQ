const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = 3000;
const CLIENT_ID = process.env.CLIENT_ID || 'unknown-cliente';
const QUEUE_NAME = 'eventos_analitica';

let channel = null;

// Conectarse a RabbitMQ con reintento
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[${CLIENT_ID}] Conectado a RabbitMQ`);
  } catch (error) {
    console.error(`[${CLIENT_ID}] Error conectando a RabbitMQ: ${error.message}`);
    console.log(`[${CLIENT_ID}] Reintentando en 5 segundos...`);
    setTimeout(connectRabbitMQ, 5000);
  }
}

// Enviar evento periódico a RabbitMQ
function enviarEvento() {
  if (!channel) {
    console.log(`[${CLIENT_ID}] Canal no disponible aún.`);
    return;
  }

  const evento = {
    cliente: CLIENT_ID,
    timestamp: new Date().toISOString(),
    tipo: 'evento_periodico'
  };

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(evento)), {
      persistent: true
    });
    console.log(`[${CLIENT_ID}] Evento periódico enviado:`, evento);
  } catch (error) {
    console.error(`[${CLIENT_ID}] Error enviando evento periódico: ${error.message}`);
  }
}

// Ruta raíz
app.get('/', (req, res) => {
  res.send(`Servicio cliente ${CLIENT_ID} corriendo.`);
});

// Ruta para evento manual
app.post('/evento', express.json(), (req, res) => {
  const evento = {
    cliente: CLIENT_ID,
    timestamp: new Date().toISOString(),
    tipo: 'evento_manual',
    datos: req.body
  };

  if (!channel) {
    return res.status(500).json({ error: 'Canal de RabbitMQ no disponible' });
  }

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(evento)), {
      persistent: true
    });
    console.log(`[${CLIENT_ID}] Evento manual enviado:`, evento);
    res.status(200).json({ mensaje: 'Evento enviado correctamente' });
  } catch (error) {
    console.error(`[${CLIENT_ID}] Error al enviar evento manual: ${error.message}`);
    res.status(500).json({ error: 'Error al enviar evento' });
  }
});

// Ruta para solicitud
app.post('/solicitud', express.json(), (req, res) => {
  const { cliente, accion } = req.body;

  if (!cliente || !accion) {
    return res.status(400).json({ error: 'Faltan datos: cliente o accion' });
  }

  const evento = {
    cliente: cliente,
    timestamp: new Date().toISOString(),
    tipo: 'solicitud',
    accion: accion
  };

  if (!channel) {
    return res.status(500).json({ error: 'Canal de RabbitMQ no disponible' });
  }

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(evento)), {
      persistent: true
    });
    console.log(`[${CLIENT_ID}] Solicitud enviada:`, evento);
    res.status(200).json({ mensaje: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error(`[${CLIENT_ID}] Error al enviar solicitud: ${error.message}`);
    res.status(500).json({ error: 'Error al enviar solicitud' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servicio cliente ${CLIENT_ID} escuchando en puerto ${PORT}`);
  connectRabbitMQ();

  // Enviar evento cada 10 segundos
  setInterval(enviarEvento, 10000);
});

