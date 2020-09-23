//error controller
exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handle400s = (err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
