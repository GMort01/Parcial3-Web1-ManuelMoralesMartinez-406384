import express, { Request, Response } from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes'; // <--- 1. IMPORTAR RUTAS
import transactionRoutes from './routes/transactionRoutes'; // <--- 1. NUEVO IMPORT
import { setupSwagger } from './swagger'; // <--- 1. IMPORTAR SWAGGER
import { getSummary } from './controllers/summaryController';
import goalRoutes from './routes/goalRoutes'; // <--- IMPORTAR RUTAS DE METAS

const app = express();
const PORT = 3001;

console.log("--- INICIANDO SISTEMA ---");

app.use(cors());
app.use(express.json());

// --- ZONA DE RUTAS ---
app.use('/categories', categoryRoutes); // <--- 2. ACTIVAR RUTAS
app.use('/goals', goalRoutes); // <--- USAR RUTAS DE METAS
// Esto significa: Todo lo que empiece por /categories lo maneja ese archivo
app.use('/transactions', transactionRoutes); // <--- 2. NUEVA RUTA
// ...
app.use('/transactions', transactionRoutes);

// RUTA DE RESUMEN (Endpoint #10 🎉)
app.get('/summary', getSummary);

// Configurar Swagger
setupSwagger(app, PORT); // <--- 2. ACTIVAR SWAGGER

app.use('/categories', categoryRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 EDISFLOW FUNCIONA EN EL PUERTO 3001 🚀');
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor corriendo en: http://localhost:${PORT}`);
})

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 EDISFLOW FUNCIONA EN EL PUERTO 3001 🚀');
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor corriendo en: http://localhost:${PORT}`);
});