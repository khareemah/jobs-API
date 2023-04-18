require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./db/connect');

// extra security packages
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// swagger
// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');
// app routes
const authRouter = require('./routes/authRoute');
const authenticateUser = require('./middleware/authenticateUser');
const jobsRouter = require('./routes/jobsRoute');
const notFoundMiddleware = require('./middleware/notfound');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());

app.get('/', (req, res) =>
  res.send('<h1>Jobs API</h1><a href="api-docs">Documentation</a>')
);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(notFoundMiddleware);
app.use(cors);
app.use(helmet);
app.use(xss);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
