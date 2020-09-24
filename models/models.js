const knex = require("../connection");

exports.fetchTopics = () => {
  return knex.select("*").from("topics");
};

exports.fetchUserByUsername = (username) => {
  return knex("users")
    .where("username", username)
    .select("*")
    .returning("*")
    .then((user) => {
      console.log("models", user);
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "this user does not exist" });
      } else {
        return { user };
      }
    });
};

exports.fetchArticleById = (id) => {
  return knex("articles")
    .where("article_id", id)
    .select("*")
    .returning("*")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "this article does not exist",
        });
      } else {
        return { article };
      }
    });
};

exports.updateArticleById = (id, updateValue) => {
  return knex("articles")
    .where("article_id", id)
    .increment("votes", updateValue)
    .returning("*")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "this article does not exist",
        });
      } else {
        return { article };
      }
    });
};

exports.postCommentByArticleId = (id, username, body) => {
  return knex("comments")
    .returning("*")
    .insert([{ author: username, article_id: id, body: body }])
    .then((res) => {
      console.log(res);
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "this article does not exist",
        });
      } else {
        return res;
      }
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return knex("comments")
    .where("article_id", id)
    .select("*")
    .returning("*")
    .then((res) => {
      return res;
    });
};
