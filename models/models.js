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

  //too stop 200 for last test
  //if .length = 0
  //promise.reject
  //check pics on phone
};
