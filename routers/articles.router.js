const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  sendCommentByArticleId,
  getCommentByArticleId,
  getArticles,
} = require("../controllers/controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(sendCommentByArticleId)
  .get(getCommentByArticleId);

module.exports = articlesRouter;
