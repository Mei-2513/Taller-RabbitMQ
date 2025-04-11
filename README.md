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

🧩 servicio-cliente-x

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
