import mongoose from 'mongoose';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { logger } from '../utils/logger';

let mongoConnection: typeof mongoose | null = null;
let postgresConnection: DataSource | null = null;

const connectMongoDB = async (): Promise<typeof mongoose | null> => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-express';
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false // Disable mongoose buffering
    });
    logger.info('Connected to MongoDB');
    return connection;
  } catch (error) {
    logger.warn('MongoDB connection failed:', error);
    // Ensure mongoose doesn't buffer commands when connection fails
    mongoose.set('bufferCommands', false);
    return null;
  }
};

const connectPostgreSQL = async (): Promise<DataSource | null> => {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DATABASE || 'backend-express',
      entities: [User],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development'
    });
    
    await dataSource.initialize();
    logger.info('Connected to PostgreSQL');
    return dataSource;
  } catch (error) {
    logger.warn('PostgreSQL connection failed:', error);
    return null;
  }
};

export const connectDatabase = async (): Promise<void> => {
  const driver = process.env.DATABASE_DRIVER || 'mongodb';
  
  if (driver === 'mongodb') {
    mongoConnection = await connectMongoDB();
    if (mongoConnection) {
      logger.info('Successfully connected to MongoDB database');
    } else {
      logger.info('Server will start without MongoDB connection. Database features will not work.');
    }
  } else if (driver === 'postgresql') {
    postgresConnection = await connectPostgreSQL();
    if (postgresConnection) {
      logger.info('Successfully connected to PostgreSQL database');
    } else {
      logger.info('Server will start without PostgreSQL connection. Database features will not work.');
    }
  } else {
    logger.error(`Unsupported database driver: ${driver}`);
    logger.info('Server will start without database connection.');
  }
};

export const getMongoConnection = () => mongoConnection;
export const getPostgresConnection = () => postgresConnection;
export const getDatabaseDriver = () => process.env.DATABASE_DRIVER || 'mongodb';