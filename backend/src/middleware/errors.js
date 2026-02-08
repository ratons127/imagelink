export const notFound = (_req, res) => {
  res.status(404).json({ message: "Not Found" });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ message });
};
