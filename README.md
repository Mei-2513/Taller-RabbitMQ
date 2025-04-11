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

## para enviar manualmente una solicitud al servicio-cliente-x, simulando el comportamiento de un cliente real:
        curl -X POST http://localhost/servicio/cliente/x1/solicitud \
  -H "Content-Type: application/json" \
  -d '{"cliente": "cliente-x1", "accion": "ver_producto"}'

        curl -X POST http://localhost/servicio/cliente/x2/solicitud \
  -H "Content-Type: application/json" \
  -d '{"cliente": "cliente-x1", "accion": "ver_producto"}'


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

## Arquitectura

El sistema está compuesto por múltiples servicios distribuidos que se comunican a través de una cola de mensajes gestionada por **RabbitMQ**. La arquitectura sigue un enfoque de microservicios desacoplados, orquestados con **Traefik** y contenedorizados con **Docker**.

- **Clientes (servicio-cliente-x1, servicio-cliente-x2)**:
  - Generan eventos periódicos o por acción del usuario.
  - Publican mensajes en RabbitMQ.

- **RabbitMQ**:
  - Sistema de mensajería que almacena los eventos temporalmente.
  - Desacopla productores (clientes) de consumidores (servicio analítico).

- **Servicio Analítico**:
  - Consume eventos desde RabbitMQ.
  - Realiza procesamiento y mantiene un conteo por cliente.

- **Traefik**:
  - Proxy inverso que expone y enruta los servicios.


---
## Diagrama de arquitectura 

![image](https://github.com/user-attachments/assets/60bb3f59-a3d1-4229-a98e-6973c2bf6507)


## 🔧 Cambios realizados respecto a la versión original

En la versión inicial del parcial, el sistema presentaba varios problemas funcionales que impedían su ejecución y pruebas adecuadas:

- Los servicios `servicio-cliente-x` no estaban sirviendo correctamente: no respondían, no publicaban eventos y ni siquiera eran detectados como servicios activos en traefik.
- El servicio `servicio-analiticas` tenía un archivo `server.js` incompleto. No manejaba la ruta `POST /analiticas`, que es clave para que los clientes puedan enviar datos.
- Solo una parte del servicio `servicio-analiticas` estaba funcional con su autenticación básica, junto con traefik, que sí corría correctamente.

Antes de avanzar al rediseño con RabbitMQ, se realizaron las siguientes correcciones necesarias:

  - Se completó el archivo `server.js` del servicio analítico, implementando correctamente la ruta `POST /analiticas`. Esta ruta ahora:
  - Expone un reporte acumulado por cliente en /reporte.
    
  - Se solucionaron los problemas de despliegue de los servicios cliente, logrando que:
  - Respondan correctamente.
  - Puedan enviar eventos a través de HTTP.
  - Se validó que `Traefik` enrute correctamente las peticiones a cada servicio.

Estas correcciones fueron fundamentales para estabilizar el sistema y permitir aplicar el rediseño basado en mensajería con RabbitMQ.

## Justificación del diseño propuesto con RabbitMQ

El rediseño propuesto introduce **RabbitMQ** como sistema de mensajería para desacoplar la comunicación entre los servicios clientes y el servicio analítico. Esta decisión se justifica por varios motivos clave:

- **Desacoplamiento**: Los servicios cliente ya no dependen de que el servicio analítico esté disponible en el momento exacto. Pueden simplemente publicar un mensaje a RabbitMQ y continuar funcionando.

- **Resiliencia**: Si el servicio analítico falla temporalmente, los mensajes permanecen en la cola hasta que el consumidor los procese, evitando la pérdida de datos.

- **Escalabilidad**: RabbitMQ permite escalar consumidores fácilmente si el volumen de mensajes crece, sin necesidad de rediseñar el flujo.

- **Flexibilidad**: Se pueden agregar nuevos consumidores para otros fines sin modificar los servicios clientes.

En el proyecto, implementamos una arquitectura distribuida basada en microservicios utilizando **Node.js**, **RabbitMQ** y **Traefik**. Los servicios clientes generan eventos que son enviados a través de una cola en RabbitMQ. Estos eventos son consumidos por un servicio de analíticas que lleva un conteo por cliente. **Traefik** gestiona el enrutamiento, exponiendo rutas protegidas y públicas, y orquesta el tráfico entre los servicios. Toda la comunicación está contenida y gestionada mediante **Docker**, lo cual asegura portabilidad, replicabilidad y facilidad de despliegue.

---
## Lecciones aprendidas sobre RabbitMQ

Durante el proceso, uno de los errores que más me costó entender fue el famoso Cannot GET /http://localhost/ cuando intenté implementar panel-visual. Descubrí que la ruta que había definido en el server.js no coincidía con la configurada en el docker-compose. Después de probar varias soluciones logre encontrar donde estaba el error, entendí que las rutas deben estar bien definidas y gestionadas correctamente a través del proxy inverso para que todo funcione como debe.

También entendí qué eran las colas en RabbitMQ. Al principio solo sabía que “algo” se enviaba y “algo” lo recibía, pero no tenía muy claro cómo funcionaba en realidad. Cuando abrí la página web (http://localhost:15672/#/), pude ver cómo los mensajes iban llegando, cómo se formaban las colas y cómo el servicio analítico los iba consumiendo poco a poco. Eso me ayudó a visualizar que los servicios no necesitan hablarse directamente todo el tiempo, y que gracias a las colas pueden trabajar de forma más ordenada y sin depender unos de otros.
