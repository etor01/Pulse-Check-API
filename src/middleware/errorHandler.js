const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500; // simple error handling. Defaults to 500 if !statusCode
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default errorHandler;