import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EdisFlow API',
      version: '1.0.0',
    },
  },
  // Busca archivos .ts durante desarrollo y .js si ya compilaste a dist
  apis: [
    path.join(__dirname, '**', '*.ts'),
    path.join(__dirname, '**', '*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express, port: number) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📄 Swagger listo en: http://localhost:${port}/api-docs`);
};