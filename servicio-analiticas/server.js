const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());
const PORT = 3000;
const QUEUE_NAME = 'eventos_analitica';

const requestCounts = {};
let channel;

// Función para conectarse a RabbitMQ con reintento automático
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('[servicio-analiticas] Conectado a RabbitMQ');

    // Consumir mensajes de la cola
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const contenido = msg.content.toString();
        try {
          const evento = JSON.parse(contenido);
          const clientId = evento.cliente || 'desconocido';

          requestCounts[clientId] = (requestCounts[clientId] || 0) + 1;
          console.log(`[RabbitMQ] Evento recibido de ${clientId}`);
        } catch (err) {
          console.error('[RabbitMQ] Error al parsear mensaje:', err.message);
        }
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('[servicio-analiticas] Error al conectar con RabbitMQ:', error.message);
    console.log('[servicio-analiticas] Reintentando en 5 segundos...');
    setTimeout(connectRabbitMQ, 5000); // Reintenta en 5 segundos
  }
}


app.get('/analiticas/reporte', (req, res) => {
  let reporte = 'Solicitudes por cliente:\n';
  for (const client in requestCounts) {
    reporte += `${client}: ${requestCounts[client]}\n`;
  }
  res.type('text/plain').send(reporte);
});


app.get('/', (req, res) => {
  res.send('Servicio de analíticas está corriendo.');
});


app.get('/analiticas/stats', (req, res) => {
  res.json(requestCounts);
});


// Iniciar servidor y conectar a RabbitMQ
app.listen(PORT, async () => {
  console.log(`servicio-analiticas escuchando en puerto ${PORT}`);
  await connectRabbitMQ();
});

