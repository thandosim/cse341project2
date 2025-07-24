const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');
const passport = require('passport');
// const { swaggerUi, swaggerSpec } = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json'); // or your swagger config

const app = express();
app.use(express.json()); // Parse JSON bodies

const port = process.env.PORT || 8080;
// const baseUrl = process.env.BASE_URL || `http://localhost:${port}`
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction ? process.env.BASE_URL : `http://localhost:${port}`;

app.use(cors());
app.use(
  (req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  }
)
app.use('/', require('./routes'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error Handler
const {errorHandler} = require('./middleware/errorHandler');
app.use(errorHandler);

// Only start server after DB connection
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and server running on ${baseUrl}`);
      console.log(`Documentation available at ${baseUrl}/api-docs`);
    });
  }
});