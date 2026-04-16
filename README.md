# WebSocket Chat Demo

Un proyecto demostrativo de una aplicación de chat en tiempo real utilizando WebSockets (con la librería `ws`) en Node.js y un cliente web en HTML/CSS/JS puro (Vanilla JS).

Este proyecto está diseñado para mostrar cómo establecer una conexión en tiempo real, enviar y recibir mensajes de forma bidireccional, y manejar eventos de conexión/desconexión de clientes, con soporte para ser desplegado en plataformas como Render u OpenShift.

## 🚀 Características

- **Comunicación en Tiempo Real**: Chat interactivo con mensajes instantáneos.
- **Identificación de Usuarios**: Asignación automática de IDs únicos a los clientes conectados (basado en timestamp).
- **Notificaciones de Sistema**: Alertas cuando un nuevo usuario se conecta o desconecta.
- **Health Check**: Incluye un endpoint `/health` (HTTP) para monitoreo del estado del servidor, útil para servicios en la nube.
- **Interfaz Intuitiva**: Cliente web responsive que muestra el estado de la conexión, contadores de mensajes y colores diferenciados para tus mensajes, los de otros y los del sistema.
- **Despliegue Fácil**: Listo para integrarse con Docker/OpenShift y servicios como Render.

## 📁 Estructura del Proyecto

```plaintext
websocket-demo/
│
├── client/                 # Código del Frontend (Cliente)
│   └── index.html          # Interfaz de usuario del chat
│
├── server/                 # Código del Backend (Servidor)
│   ├── server.js           # Lógica principal del servidor WebSocket/HTTP
│   ├── package.json        # Dependencias del backend (solo `ws`)
│   └── Dockerfile          # Configuración para despliegue con contenedores
│
└── package.json            # Script iniciador y metadatos del directorio raíz
```

## 📋 Requisitos Previos

Necesitarás tener instalado lo siguiente en tu máquina para ejecutar este proyecto localmente:

- [Node.js](https://nodejs.org/es/) (v18.0.0 o superior)
- NPM (generalmente viene incluido con Node.js)

## 🛠️ Instalación

1. Clona este repositorio o descarga el código fuente.
2. Abre la terminal en el directorio raíz del proyecto:
   ```bash
   cd websocket-demo
   ```
3. Instala las dependencias del servidor:
   ```bash
   cd server
   npm install
   ```

## ▶️ Ejecución Local

Para correr el proyecto en tu entorno local de manera rápida, vuelve al directorio raíz (`websocket-demo`) y utiliza el script predeterminado:

```bash
npm start
```
Este comando realizará dos acciones al mismo tiempo:
1. Abrirá el cliente (`client/index.html`).
2. Iniciará el servidor de Node en el puerto 8080.

*Nota:* Si quieres iniciar solo el servidor, ve a la carpeta `server` y ejecuta `npm start`.

### Uso del Cliente:
- Cuando abras el cliente local, la URL por defecto apunta a la nube (`wss://...`). Para probarlo de forma local, cambia la URL de conexión en el panel izquierdo a:
  ```
  ws://localhost:8080
  ```
- Dale al botón "Conectar" y el indicador de estado cambiará a "Conectado".
- Abre otra pestaña o navegador para simular a otro usuario y comienza a chatear.

## ☁️ Despliegue en la Nube

El proyecto está preparado para ser publicado fácilmente.

- **Servidor HTTP Base:** El servidor corre sobre HTTP normal, exponiendo la ruta `/health` y sirviendo `index.html` por defecto en la ruta principal. Esto asegura que sistemas en la nube que requieren puertos HTTP expuestos (como Render) o comprobaciones de vida (como OpenShift) funcionen correctamente.
- **Docker:** El directorio `server` incluye un `Dockerfile` que empaqueta y levanta la aplicación lista para un servicio de contenedores. Para construirlo localmente puedes usar `docker build -t ws-chat-demo .`.
- **Render.com:** Por defecto, el cliente viene pre-configurado con un ejemplo de URL para tu servicio alojado en Render (`wss://mi-chat-websocket.onrender.com`). Recuerda actualizar este valor con la URL real de tu instancia en producción cuando despliegues.

---
*Este proyecto fue generado como demostración técnica de capacidades de WebSocket puro y despliegue simple.*
