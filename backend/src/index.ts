import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config';
import { connectDB } from './utils/database';
import routes from './routes';
import errorHandler from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start(); 