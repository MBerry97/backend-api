const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  sendCommentByArticleId,
  getCommentByArticleId,
} = require("../controllers/controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(sendCommentByArticleId)
  .get(getCommentByArticleId);

module.exports = articlesRouter;
