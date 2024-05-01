import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import passport from 'passport';


import vacancyRouter from './routes/vacancy.routes';
import authRouter from './routes/auth.routes';
import { MyPassport } from './middleware/passport';

export const app = express();

app.use(cors());
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
