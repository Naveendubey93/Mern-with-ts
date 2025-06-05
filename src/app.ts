import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
// app.options('*', cors()); // Preflight support

app.use(express.static('public'));
app.use(cookieParser());
app.get('/', async (req, res) => {
  res.status(201).send('Welcome to auth application');
});
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

app.use(globalErrorHandler);

export default app;
