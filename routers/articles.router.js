const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  sendCommentByArticleId,
} = require("../controllers/controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.post("/:article_id/comments", sendCommentByArticleId);

module.exports = articlesRouter;
