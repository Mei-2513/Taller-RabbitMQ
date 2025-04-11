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

## ✅ Actividades del Taller
