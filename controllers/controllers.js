const { fetchTopics, fetchUserByUsername } = require("../models/models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    console.log({ topics });
    res.status(200).send({ topics });
  });
};

exports.getUsers = (req, res, next) => {
  const username = req.params.username;

  fetchUserByUsername(username)
    .then((user) => {
      console.log("user log", user);
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};
