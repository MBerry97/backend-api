const app = require("../app");
const request = require("supertest");
const connection = require("../connection");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  return connection.destroy();
});

describe("/api", () => {
  it("GET request to invalid paths produce a 404", () => {
    return request(app).get("/api/jopikz").expect(404);
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("GET /topics should return with a 200", () => {
        return request(app).get("/api/topics/").expect(200);
      });
      it("GET /topics should return an object with a topics key which the value is an array", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            const values = Object.values(res.body.topics);
            console.log(values);
            expect(Object.keys(res.body)[0]).toBe("topics");
            expect(Array.isArray(res.body.topics)).toBe(true);
          });
      });
      it("GET /topics array should contain objects with the keys slug and description", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics[0].slug).toEqual("mitch");
            expect(res.body.topics[0].description).toEqual(
              "The man, the Mitch, the legend"
            );
          });
      });
    });
  });
  describe("/users/:username", () => {
    describe("GET", () => {
      it("GET /users/:username should return with a 200 status code", () => {
        return request(app).get("/api/users/icellusedkars").expect(200);
      });
      it("GET /users/:username returns an object", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe("object");
          });
      });
      it("GET /users/:username returns an object with a key of user", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then((res) => {
            const keysOfRes = Object.keys(res.body);
            expect(keysOfRes).toEqual(expect.arrayContaining(["user"]));
          });
      });
      it("GET /user/:username returns the values as an array containing an object of the correct user", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then((res) => {
            const keysOfRes = Object.keys(res.body.user[0]);
            expect(Array.isArray(res.body.user)).toBe(true);
            expect(res.body.user[0].username).toBe("icellusedkars");
            expect(keysOfRes).toEqual(
              expect.arrayContaining(["username", "avatar_url", "name"])
            );
          });
      });
      it("GET request to invalid URL return a 404", () => {
        return request(app)
          .get("/api/userrrr/isellkkars")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("path not found");
          });
      });
      it("GET request to valid path but the user does not exists returns a 404", () => {
        return request(app)
          .get("/api/users/notAcorrectUser")
          .expect(404)
          .then((res) => {
            console.log(res.body);
            expect(res.body.msg).toBe("this user does not exist");
          });
      });
    });
  });
  describe("/articles/:article_id", () => {
    describe("GET", () => {
      it("GET /articles/:article_id Returns a 200 status code when path is valid", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
      it("GET /articles/:article_id return an object with the key of article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            console.log(res.body);
            expect(res.body).toHaveProperty("article");
          });
      });
      it("GET /articles/:article_id returns an object with the key of article which is an array containing an object of the correct keys", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            const keysOfArticle = Object.keys(res.body.article[0]);
            console.log(keysOfArticle);
            expect(Array.isArray(res.body.article)).toBe(true);
            expect(keysOfArticle).toEqual(
              expect.arrayContaining([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
              ])
            );
          });
      });
      it("GET request to a invalid path returns a 404", () => {
        return request(app).get("/api/artiklez/2").expect(404);
      });
      it("GET request to valid path but invalid article returns 404", () => {
        return request(app)
          .get("/api/articles/100")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("this article does not exist");
          });
      });
    });
    describe("PATCH", () => {
      it("PATCH Returns a 200 status code to a valid path", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 2 });
      });
      it("PATCH Returns an object with the key of article", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 2 })
          .then((res) => {
            expect(res.body).toHaveProperty("article");
          });
      });
      it("PATCH Returns an object with the votes key updated by specified amount", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 2 })
          .then((res) => {
            //article 1 votes is currently 102
            expect(res.body.article[0].votes).toBe(102);
          });
      });
      it("PATCH Returns the correct article containing the correct keys", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 2 })
          .then((res) => {
            const keysOfArticle = Object.keys(res.body.article[0]);
            expect(res.body.article[0].article_id).toBe(1);
            expect(keysOfArticle).toEqual(
              expect.arrayContaining([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
              ])
            );
          });
      });
      it("PATCH Returns 404 when the path is invalid", () => {
        return request(app)
          .patch("/api/artikle")
          .expect(404)
          .send({ inc_votes: 2 });
      });
      it("PATCH Returns a 404 when the path is valid but the article does not exist", () => {
        return request(app)
          .patch("/api/articles/300")
          .expect(404)
          .send({ inc_votes: 2 })
          .then((res) => {
            expect(res.body.msg).toBe("this article does not exist");
          });
      });
      it("PATCH Returns 400 bad request when path contains a bad request ", () => {
        return request(app)
          .patch("/api/articles/banana")
          .expect(400)
          .send({ inc_votes: 2 })
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
    });
  });
  describe("/articles/:article_id/comments", () => {
    describe("POST", () => {
      it("POST Returns a 201 status code to a valid path", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(201)
          .send({ username: "butter_bridge", body: "this is a great article" });
      });
      it("POST Returns a the posted comment in an object with a comment key", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(201)
          .send({ username: "butter_bridge", body: "this is a great article" })
          .then((res) => {
            expect(res.body).toHaveProperty("comment");
          });
      });
      it("POST Returns the new comment object with the correct keys and values", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(201)
          .send({ username: "butter_bridge", body: "this is a great article" })
          .then((res) => {
            const commentObjKeys = Object.keys(res.body.comment[0]);
            expect(commentObjKeys).toEqual(
              expect.arrayContaining([
                "comment_id",
                "author",
                "article_id",
                "votes",
                "body",
                "created_at",
              ])
            );
            expect(res.body.comment[0].author).toBe("butter_bridge");
            expect(res.body.comment[0].body).toBe("this is a great article");
            expect(typeof res.body.comment[0].comment_id).toBe("number");
          });
      });
      it("POST Returns 404 when a invalid path is entered", () => {
        return request(app)
          .post("/api/articles/2/comentzzz")
          .expect(404)
          .send({ username: "butter_bridge", body: "this is a great article" })
          .then((res) => {
            expect(res.body.msg).toBe("path not found");
          });
      });
      it("POST Returns a 404 when the path is valid but the article does not exist", () => {
        return request(app)
          .post("/api/articles/200/comments")
          .expect(404)
          .send({ username: "butter_bridge", body: "this is a great article" })
          .then((res) => {
            expect(res.body.msg).toBe("path or user does not exist");
          });
      });
      it("POST Returns a 404 when specified username does not exist", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(404)
          .send({ username: 3434, body: 8888 })
          .then((res) => {
            expect(res.body.msg).toBe("path or user does not exist");
          });
      });
      it("POST Responds a 400 bad request if the username input is missing", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({ body: 8888 })
          .then((res) => {
            console.log(res.body);
            expect(res.body.msg).toBe("bad request");
          });
      });
      it("POST Responds a 400 bad request if the body input is missing", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({ username: "butter_bridge" })
          .then((res) => {
            console.log(res.body);
            expect(res.body.msg).toBe("bad request");
          });
      });
    });
    describe("GET", () => {
      it("GET Returns a 200 status code with a valid request", () => {
        return request(app).get("/api/articles/9/comments").expect(200);
      });
      it("Retuns an object with the key - comments", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((res) => {
            console.log(res);
            expect(res.body).toHaveProperty("comments");
          });
      });
      it("Returns an object with the correct keys of the correct article", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((res) => {
            let commentKeys = Object.keys(res.body.comments[0]);
            expect(res.body.comments[0].article_id).toBe(9);
            expect(commentKeys).toEqual(
              expect.arrayContaining([
                "comment_id",
                "author",
                "article_id",
                "votes",
                "body",
                "created_at",
              ])
            );
          });
      });
      it("Returns the comments sorted by the default created_at", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((res) => {
            console.log(res.body.comments);
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("Returns the comments sorted by a valid input in descending order", () => {
        return request(app)
          .get("/api/articles/9/comments?sort_by=votes")
          .expect(200)
          .then((res) => {
            console.log(res.body.comments);
            expect(res.body.comments).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      it("GET Returns the comment sorted by a valid input in ascending order and descending by default", () => {
        return request(app)
          .get("/api/articles/9/comments?sort_by=votes&order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("votes", {
              ascending: true,
            });
          });
      });
      it("Returns a 404 when a invalid path is entered", () => {
        return request(app).get("/api/articlesnum9/9/comments").expect(404);
      });
      it("Return a 404 when the path is valid but the article does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("this article does not exist");
          });
      });
    });
  });
  describe.only("/articles", () => {
    describe("GET", () => {
      it("Returns a 200 to a valid path", () => {
        return request(app).get("/api/articles").expect(200);
      });
      it("Return an object with the key of articles which holds an array of object that contain the correct keys", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            let keysOfArticle = Object.keys(res.body.articles[0]);
            console.log(keysOfArticle);
            expect(res.body).toHaveProperty("articles");
            expect(keysOfArticle).toEqual(
              expect.arrayContaining([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
              ])
            );
          });
      });
      it("Returns a key of comment_count which sums to the amount of comments for each article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0]).toHaveProperty("comment_count");
          });
      });
      it("Accepts a sort_by query which succesfully sorts articles by a valid input", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      it("The default sort_by is created_at", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("Accepts an order query and returns it in that order", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then((res) => {
            console.log(res.body.articles);
            expect(res.body.articles).toBeSortedBy("created_at", {
              ascending: true,
            });
          });
      });
      it("Accepts a author query and returns articles by the specified author", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then((res) => {
            console.log(res.body.articles);
            expect(res.body.articles[0].author).toBe("rogersop");
          });
      });
      it("Accepts a topic query and returns the correct articles that belong to that topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((res) => {
            console.log(res.body);
            expect(res.body.articles[0].topic).toEqual("cats");
          });
      });
      it("Accepts a topic and author query and returns the correct articles", () => {
        return request(app)
          .get("/api/articles?topic=mitch&author=butter_bridge")
          .expect(200)
          .then((res) => {
            let authorArr = [];
            let topicArr = [];

            res.body.articles.forEach((article) => {
              authorArr.push(article.author);
              topicArr.push(article.topic);
            });

            const isSameAuthor = authorArr.every((name) => {
              return name === "butter_bridge";
            });
            const isSameTopic = topicArr.every((topic) => {
              return topic === "mitch";
            });
            expect(isSameAuthor).toBe(true);
            expect(isSameTopic).toBe(true);
          });
      });
      it.only("Accepts all queries and return the correct article depending on the queries", () => {
        return request(app)
          .get(
            "/api/articles?sort_by=votes&order=asc&author=rogersop&topic=cats"
          )
          .expect(200)
          .then((res) => {
            let authorArr = [];
            let topicArr = [];

            res.body.articles.forEach((article) => {
              authorArr.push(article.author);
              topicArr.push(article.topic);
            });

            const isSameAuthor = authorArr.every((name) => {
              return name === "rogersop";
            });
            const isSameTopic = topicArr.every((topic) => {
              return topic === "cats";
            });
            console.log(authorArr);
            console.log(topicArr);
            expect(res.body.articles).toBeSortedBy("votes", {
              ascending: true,
            });
            expect(isSameAuthor).toBe(true);
            expect(isSameTopic).toBe(true);
          });
      });
    });
  });
});
