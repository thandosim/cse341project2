// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    details: err.details || null,
  });
};

function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}


module.exports = {
  errorHandler,
  handleErrors,
};
