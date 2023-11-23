import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// !--> error Handler <-- //
import { notFound, errorHandler } from './middleware/errorMiddelware.js';

// !--> routes import <-- //
import userRoute from './routes/userRoute.js';
import transactionsRoute from './routes/transactionsRoute.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://myCashApp.onrender.com'],
  })
);

// * --> ALL ROUTES <-- //

// ---- { User Routes } ---- //
app.use('/api/users', userRoute);
// ---- { transactions Expenses & Incomes Routes } ---- //
app.use('/api/transactions', transactionsRoute);

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

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
app.use(notFound);
app.use(errorHandler);
