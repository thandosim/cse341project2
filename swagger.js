const swaggerAutogen = require('swagger-autogen')();

const host = process.env.HOST || 'localhost:8080';

const doc = {
  info: {
    title: 'user API',
    description: 'User API for managing users'
  },
  host: host,
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
