import 'dotenv/config';

export type TServerConfig = {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin?: string;
};

export const serverConfig: TServerConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/tec2Center',
  jwtSecret: process.env.JWT_SECRET || 'tec2-center-jwt',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default serverConfig;
