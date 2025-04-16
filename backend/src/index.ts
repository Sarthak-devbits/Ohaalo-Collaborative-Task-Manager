import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { routes } from './routes';
import { config } from './config';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Middleware

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port http://localhost:${config.port}`);
});
