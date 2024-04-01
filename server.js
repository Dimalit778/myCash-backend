import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
// !--> error Handler <-- //
import { errorHandler } from './middleware/errorMiddleware.js';

//@  --> routes import <-- //
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import transactionsRoute from './routes/transactionsRoute.js';
import { verifyToken } from './middleware/authMiddleware.js';

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();
// Front Url --->

app.use(
  cors({
    origin: 'https://mycash-ra2a-yxco.onrender.com',
    // origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.set('trust proxy', 1);
// * --> ALL ROUTES <-- //

//@ ---- { User Routes } ---- //
app.use('/api/users', verifyToken, userRoute);
//@ ---- { Auth Routes } ---- //
app.use('/api/auth', authRoute);
//@ ---- { transactions Expenses & Incomes Routes } ---- //
app.use('/api/transactions', verifyToken, transactionsRoute);
// Re render Render Service
app.use('/api/renderSite', (req, res) => {
  res.send('renderSite');
});

/// -- connection to DB
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(process.env.DB, dbOptions)
  .then(() => console.log('DB store connected!'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('running on port ' + port);
  console.log('Connected to backend');
});
// -----> FOR PRODUCTION
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const static_path = path.resolve(__dirname, 'front', 'build');
  app.use(express.static(path.join(static_path)));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(static_path, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
// app.use(notFound);
app.use(errorHandler);
