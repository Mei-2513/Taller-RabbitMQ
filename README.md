## 📁 Estructura del Proyecto
Parcial2/
├── docker-compose.yml         # Orquestación de todos los servicios
├── traefik.yml                # Configuración personalizada para Traefik
├── panel-visual/              # Servicio que consulta al analítico
│   ├── Dockerfile
│   └── server.js
├── servicio-analiticas/       # Servicio que consume eventos desde RabbitMQ
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── servicio-cliente-x/        # Servicio que publica eventos a RabbitMQ
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── README.md


---

## Instrucciones para Ejecutar el Proyecto

### 1. Clonar el repositorio

git clone https://github.com/Mei-2513/Taller-RabbitMQ.git

## 2.Verificar requisitos
Asegúrate de tener instalados:

    -Docker 

    -Docker Compose → integrado en Docker moderno

## 3. Levantar los servicios 
Desde la raíz del proyecto:

docker compose up --build

## Esto iniciará:

🧩 servicio-cliente-x1
🧩 servicio-cliente-x2

📊 servicio-analiticas

🖥️ panel-visual

📨 RabbitMQ

⚙️ Traefik

## 4. Acceder a los servicios

📊 Panel visual: http://localhost/panel

📨 RabbitMQ (admin): http://localhost:15672

Usuario: guest

Contraseña: guest

⚙️ Traefik:http://localhost:8080

## 5. Ver logs

docker compose logs -f

## ✅ Actividades del Taller

## 1. Revisión conceptual
¿Qué es RabbitMQ y cuál es su función en una arquitectura distribuida??
Es un sistema de mensajería basado en colas que permite comunicación asincrónica entre servicios. Facilita el desacoplamiento y la escalabilidad.

¿Qué ventajas ofrece frente a llamadas HTTP directas entre servicios??

    -Comunicación asincrónica

    -Mayor tolerancia a fallos

    -Desacoplamiento entre productor y consumidor

    -Mejora la escalabilidad

¿Qué son colas, exchanges, publishers y consumers?

    -Publisher: Servicio que envía mensajes.

    -Exchange: Recibe mensajes y los redirige según reglas.

    -Cola (Queue): Almacena mensajes en espera de ser consumidos.

    -Consumer: Servicio que procesa los mensajes.
    
## 2. Análisis del sistema actual
Identificar en la arquitectura del parcial actual:

¿Quién produce eventos?
    servicio-cliente-x

¿Quién consume eventos?
    servicio-analiticas

¿Dónde existen acoplamientos directos que podrían desacoplarse?
    servicio-cliente-x hacía una llamada directa HTTP a servicio-analiticas

## Preguntas del Taller

1.¿Qué beneficio aporta RabbitMQ en comparación con el modelo de solicitud  directa HTTP?
Permite comunicación asincrónica, desacopla servicios y mejora la resiliencia.

2.¿Qué problemas podrían surgir si se caen algunos servicios?
Los mensajes siguen encolados y serán procesados cuando el consumidor vuelva.

3.¿Cómo ayuda RabbitMQ a mejorar la resiliencia del sistema?
Evita pérdida de mensajes y desacopla el tiempo entre productor y consumidor.

4.¿Cómo cambiaría la lógica de escalabilidad con esta nueva arquitectura?
Se pueden agregar múltiples productores o consumidores sin afectar el diseño.

5.¿Qué formato de mensaje es más conveniente y por qué (JSON, texto plano,etc.)?
JSON: porque es fácil de leer, estructurado, ampliamente soportado en sistemas distribuidos.

