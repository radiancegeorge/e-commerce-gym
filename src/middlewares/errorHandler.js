const errHandler = async (error, req, res, next) => {
  const status = error.status;
  delete error.status;
  res.status(status ?? 500).send(error);
};

module.exports = errHandler;
