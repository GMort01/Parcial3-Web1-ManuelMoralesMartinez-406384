# **🌃 EdisFlow: Sistema de Gestión Financiera Corporativa (v5.0)**

1. **Enunciado del Proyecto**

Título: **EdisFlow**
Contexto: Night City (Universo Cyberpunk 2077).

Propósito:
Desarrollar una aplicación Full-Stack de alto rendimiento diseñada para mercenarios y habitantes de Night City. El sistema permite el rastreo táctico de flujos de ingreso (contratos, hackeos) y egresos (implantes, suministros) utilizando la divisa estándar: Edis.

Problemática:
La supervivencia en Night City depende de la gestión de recursos. Los sistemas bancarios tradicionales son lentos. EdisFlow ofrece una interfaz "Edge", rápida y visual, con capacidad de análisis predictivo (IA) para evitar la bancarrota y maximizar el Street Cred.

2. **Stack Tecnológico (Herramientas Utilizadas)**

Este proyecto ha sido construido utilizando una arquitectura moderna y modular:

**🎨 Frontend (Cliente)**

- Framework: Vue 3 (Composition API + Script Setup).

- Lenguaje: TypeScript (Strict typing).

- Build Tool: Vite.

- Estilos: Tailwind CSS (Configuración personalizada con paleta Neón/Cyberpunk).

- Visualización de Datos: Chart.js + vue-chartjs (Para CORTEX_AI).

- Comunicación HTTP: Axios.

- Fuentes: Google Fonts (Rajdhani & Share Tech Mono).

**⚙️ Backend (Servidor)**

- Runtime: Node.js.

- Framework: Express.js.

- Lenguaje: TypeScript.

- ORM: Prisma (Manejo de base de datos y migraciones).

- Base de Datos: SQLite (Archivo local dev.db).

- Documentación API: Swagger UI (swagger-ui-express + swagger-jsdoc).

- Utilidades: CORS, Dotenv.

3. **Arquitectura del Sistema**

El proyecto sigue una arquitectura Cliente-Servidor RESTful.

Backend: Expone una API REST en el puerto 3001. Maneja la lógica de negocio y la persistencia de datos.

Frontend: Consume la API para mostrar datos en tiempo real. Implementa lógica de presentación, enrutamiento virtual (simulado) y gestión de estado reactivo.

Estructura de Carpetas (Frontend)

/components: Piezas reutilizables (Sidebar, Gráficas, Alertas, Modales).

/views: Pantallas principales (Dashboard, Transactions, Stash, Profile).

/services: Lógica de conexión con la API (Axios).

/composables: Lógica reutilizable (Sistema de notificaciones).

4. **Diagrama de Clases (Modelo de Datos)**

Representación de las entidades gestionadas por Prisma y sus relaciones.
classDiagram
    %% Entidad para clasificar gastos e ingresos
    class Category {
        +Int id
        +String name
        +String icon
        +String color
        +Transaction[] transactions
    }

    %% Registro principal de movimientos
    class Transaction {
        +Int id
        +Float amount
        +String description
        +String type (INCOME/EXPENSE)
        +DateTime date
        +Int categoryId
        +Category category
    }

    %% Sistema de Ahorro (The Stash)
    class Goal {
        +Int id
        +String name
        +Float targetAmount
        +Float currentAmount
        +String icon
    }

    %% Relaciones
    Category "1" --o "0..*" Transaction : clasifica
