import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import serverConfig from './config/server.config';

import vacancyRoutes from './routes/vacancy.routes';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employees.routes';
import { MyPassport } from './middleware/passport';
import { menuRoutes } from './routes/menu.routes';
import workPlanRoutes from './routes/workPlan.routes';
import scheduleRoutes from './routes/schedules.routes';
import busRoutes from './routes/bus.routes';
import routeMapsRoutes from './routes/routeMaps.routes';
import testRoutes from './routes/tests.routes';
import foodMenuRoutes from './routes/foodMenu.routes';


export const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
MyPassport(passport);

export const port = serverConfig.port;

app.get('/', (req, res) => {
  res.send('<h1>tec2 staff center</h1>');
});

// routes
app.use('/vacancies', vacancyRoutes);
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/foodMenu', menuRoutes);
app.use('/workPlans', workPlanRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/busRoutes', busRoutes);
app.use('/routeMaps', routeMapsRoutes);
app.use('/tests', testRoutes);
app.use('/food-menu', foodMenuRoutes);
