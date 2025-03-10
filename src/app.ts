import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import taskRoutes from './modules/task/task.routes';
import { errorHandler } from './core/http/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.database();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    this.express.use(express.json());
  }

  private async database(): Promise<void> {
    try {
      await mongoose.connect('mongodb://localhost:27017/teste-todo');
      console.log('Conectado ao MongoDB');
    } catch (error) {
      console.error('Falha na conexão com MongoDB:', error);
      process.exit(1);
    }
  }

  private routes(): void {
    this.express.use(authRoutes);
    this.express.use(userRoutes);
    this.express.use(taskRoutes);
    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private errorHandling(): void {
    this.express.use(errorHandler);
  }
}

export default new App().express;
