export const shouldLogRequests = () => process.env.NODE_ENV !== "test";

export const requestLogger = (req, res, next) => {
  if (shouldLogRequests()) {
    console.log(`${req.method} ${req.originalUrl}`);
  }

  next();
};

