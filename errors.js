//error controller
exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handle404s = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
