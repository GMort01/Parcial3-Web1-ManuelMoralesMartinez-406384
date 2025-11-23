# 🌆 EdisFlow OS - Cyberpunk Finance Tracker

Sistema de gestión financiera personal con estética inmersiva Cyberpunk 2077. Desarrollado como proyecto final de [Nombre de tu Asignatura/Curso].

## 📺 Demo y Explicación

**[PEGAR AQUÍ EL ENLACE DE TU VIDEO DE YOUTUBE O LOOM]**

---

## 🚀 Características Principales

- **Dual Theme Engine:** Cambio en tiempo real entre modo "Night City" (Cyberpunk oscuro) y "Arasaka Corpo" (Minimalista corporativo).
- **Gestión de Transacciones:** CRUD completo (Crear, Leer, Actualizar, Eliminar) conectado a una API REST simulada.
- **Sistema de Progresión:** Barra de experiencia y niveles de reputación basados en el saldo acumulado.
- **Persistencia de Datos:** Uso de LocalStorage para mantener la sesión y preferencias del usuario.

## 🛠️ Tecnologías Usadas

- **Framework:** Vue 3 (Composition API) + TypeScript
- **Estilos:** Tailwind CSS
- **Build Tool:** Vite
- **Backend Simulado:** JSON-Server

## 📂 Estructura del Proyecto

El código se organiza de forma modular:
- `/src/components`: Componentes UI reutilizables (Sidebar, Modales, Alertas).
- `/src/views`: Vistas principales (Dashboard, Transacciones, Perfil).
- `/src/services`: Lógica de comunicación con la API (Axios).

## **🚀 Guía de Instalación**

Sigue estos pasos para desplegar el sistema en tu máquina local.

1. **Clonar el Repositorio**

Abre tu terminal y ejecuta:

git clone https://github.com/GMort01/Parcial3-Web1-ManuelMoralesMartinez-406384.git
cd EdisFlow


1. **Configuración del Backend (Servidor)**

El backend maneja la API y la base de datos.

- Entrar a la carpeta del backend
   cd backend

- Instalar dependencias
   npm install

- Configurar la Base de Datos (SQLite)
- Esto creará el archivo dev.db y las tablas necesarias
   npx prisma migrate dev --name init

- (Opcional) Llenar la base de datos con datos de prueba
- Ejecuta esto si quieres ver la app con datos ficticios al iniciar
   npm run seed

- Iniciar el servidor en modo desarrollo
   npm run dev


Nota: El servidor correrá en http://localhost:3001.
Puedes ver la documentación de la API en http://localhost:3001/api-docs.

1. **Configuración del Frontend (Cliente)**

Abre una nueva terminal (sin cerrar la del backend) para iniciar la interfaz visual.

- Volver a la raíz si estás en backend, o entrar a frontend
   cd frontend

- Instalar dependencias (Vue, Tailwind, Chart.js, etc.)
   npm install

- iniciar el servidor de desarrollo
   npm run dev


Nota: El frontend correrá usualmente en http://localhost:5173 (o el puerto que indique la terminal).

📦 **Dependencias Principales**

Estas son las librerías clave que hacen funcionar el sistema:

Backend:

- express: Servidor web rápido y minimalista.

- prisma: ORM moderno para interactuar con la base de datos SQLite.

- swagger-ui-express / swagger-jsdoc: Generación automática de documentación API.

- cors: Habilita la comunicación entre frontend y backend.

- Iniciar el servidor de desarrollo:
   npm run dev

Frontend:

- vue: Framework progresivo de JavaScript.

- vue-router: Gestión de navegación y rutas virtuales.

- tailwindcss: Framework de utilidades CSS para el diseño Cyberpunk.

- axios: Cliente HTTP para conectar con el backend.

- chart.js / vue-chartjs: Motor de visualización de datos para CORTEX_AI.

- Iniciar el servidor JSON (en otra terminal):
   npm run server

## **👤 Autor**

Desarrollado por Manuel Morales Martinez para el Taller del parcial numero 3.