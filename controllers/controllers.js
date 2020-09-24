const e = require("express");
const {
  fetchTopics,
  fetchUserByUsername,
  fetchArticleById,
  updateArticleById,
  postCommentByArticleId,
  fetchCommentsByArticleId,
  fetchArticles,
} = require("../models/models");

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

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id);
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.sendCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  postCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  console.log(order);
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchArticles(sort_by, order, author, topic).then((articles) => {
    res.status(200).send({ articles });
  });
};
