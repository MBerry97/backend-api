//error controller
exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handle400s = (err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};
//psql err 404s
exports.psql404s = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "path or user does not exist" });
  } else {
    next(err);
  }
};

//change name of this, custom404s
exports.handle404s = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
