import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import passport from 'passport';

import vacancyRoutes from './routes/vacancy.routes';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employees.routes';
import { MyPassport } from './middleware/passport';
import { menuRoutes } from './routes/menu.routes';
import workPlanRoutes from './routes/workPlan.routes';
import scheduleRoutes from './routes/schedules.routes';
import busRoutes from './routes/bus.routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
MyPassport(passport);

export const port = process.env.PORT || 5000;

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
