const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/controllers");

usersRouter.get("/:username", getUsers);

module.exports = usersRouter;
