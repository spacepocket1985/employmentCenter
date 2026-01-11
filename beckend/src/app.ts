import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import passport from 'passport';


import vacancyRouter from './routes/vacancy.routes';
import authRouter from './routes/auth.routes';
import employeeRouter from './routes/employees.routes';
import { MyPassport } from './middleware/passport';
import { menuRoutes } from './routes/menu.routes';

export const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
MyPassport(passport);

export const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('<h1>List of vacancies using typescript</h1>');
});

// routes
app.use('/vacancies', vacancyRouter);
app.use('/auth', authRouter);
app.use('/employees', employeeRouter);
app.use('/foodMenu', menuRoutes);
