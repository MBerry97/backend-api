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

exports.fetchCommentsByArticleId = (
  id,
  sort_by = "created_at",
  order = "desc"
) => {
  return knex("comments")
    .where("article_id", id)
    .select("*")
    .orderBy(sort_by, order)
    .returning("*")
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

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .then((res) => {
      if (author) {
        let filteredAuthor = res.filter((article) => {
          return author === article.author;
        });
        if (topic) {
          let filterTopicByAuthor = filteredAuthor.filter((article) => {
            return topic === article.topic;
          });
          return filterTopicByAuthor;
        }
        return filteredAuthor;
      }
      if (topic) {
        let filterTopic = res.filter((article) => {
          return topic === article.topic;
        });
        return filterTopic;
      } else {
        return res;
      }
    });

  // .returning("*");
  //promise.all for error handling
  //join comments
  //where comments.article_id = articles.article_id
};
