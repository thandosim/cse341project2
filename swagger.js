const swaggerAutogen = require('swagger-autogen')();

// const host = process.env.HOST || 'localhost:8080';

// const doc = {
//   info: {
//     title: 'user API',
//     description: 'User API for managing users'
//   },
//   host: host,
//   schemes: ['http', 'https']
// };

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://cse341project2-q71q.onrender.com'
    : 'http://localhost:8080';

const doc = {
  info: {
    title: 'User API',
    version: '1.0.0'
  },
  host: baseUrl.replace(/^https?:\/\//, ''),
  schemes: ['https']
};


const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
