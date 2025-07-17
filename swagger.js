const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'user API',
    description: 'User API for managing users'
  },
  host: 'localhost:8080',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
