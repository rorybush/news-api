const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { TestWatcher } = require("jest");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("Error Tests", () => {
  test("it should return 404 error message when a request to an invalid endpoint is made", () => {
    return request(app)
      .get("/api/topicss")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Path not found." });
      });
  });
});

describe("GET /api/topics", () => {
  test("it should return the data and status 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(topics).toHaveLength(3);
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("it should return the data and status 200", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("it should return the data in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("returns status 200 and the requested article limit", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(2);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("it should return the article and status 200", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        const result = {
          article_id: 1,
          title: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          body: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
        };
        expect(article).toBeInstanceOf(Object);
        expect(article).toMatchObject(result);
      });
  });
  test("it should return 404 error and article not found message if no article for that id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ msg: "No Article Found." });
      });
  });
  test("it should return 400 bad request error and invalid article id message", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Invalid ID" });
      });
  });
  test("it should return status 200 and each article should now have a comment_count key", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toHaveProperty("comment_count");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should return the comments for the article ID provided", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments[1]).toHaveLength(11);
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("returns the comments sorted by most recently posted", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toBeSortedBy("created_at");
      });
  });

  test("returns 404 error if article id does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ msg: "No Article Found." });
      });
  });

  test("returns an empty array if the article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments[1]).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("returns status 201 and the newly created comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "test body test123 bananas kiwi apple pear !=+#",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send(newComment)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          body: "test body test123 bananas kiwi apple pear !=+#",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("returns status 400 if username is not provided", () => {
    const commentNoUser = {
      body: "test body test123 bananas kiwi apple pear !=+#",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send(commentNoUser)
      .then(({ body }) => {
        expect(body.msg).toBe("Username or Body has not been provided.");
      });
  });
  test("returns status 400 if body is not provided", () => {
    const commentNoBody = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send(commentNoBody)
      .then(({ body }) => {
        expect(body.msg).toBe("Username or Body has not been provided.");
      });
  });

  test("returns status 404 if the article is not found", () => {
    const newComment = {
      username: "butter_bridge",
      body: "test body test123 bananas kiwi apple pear !=+#",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .expect(404)
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article Found");
      });
  });
  test("400 - invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "test body test123 bananas kiwi apple pear !=+#",
    };
    return request(app)
      .post("/api/articles/bananas/comments")
      .expect(400)
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  test("returns status 404 if input is a valid username but it does not exist in the database ", () => {
    const newComment = {
      username: "roryb",
      body: "this username does not exist in the db",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(404)
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("No Username Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("returns status 200 with the article votes updates", () => {
    const votes = { inc_votes: 101 };
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send(votes)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 201,
        });
      });
  });

  test("returns status 400 if the id for the article is invalid", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/banana")
      .expect(400)
      .send(votes)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  test("returns status 404 if the article cannot be found", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/99999")
      .expect(404)
      .send(votes)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article Found.");
      });
  });
  test("returns status 400 if the vote input is invalid", () => {
    const votes = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .send(votes)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});

describe("GET /api/users", () => {
  test("should return status 200 and an array of objects with the user information", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles (queries)", () => {
  describe("topic type query", () => {
    test("return status 200 and filters the articles by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(1);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "cats",
              })
            );
          });
        });
    });
    test("returns status 404 not found if an invalid topic has been entered", () => {
      return request(app)
        .get("/api/articles?topic=bananas")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Topic");
        });
    });
    test("return status 200 and an empty array if the topic exists but there are no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
  });
  describe("sort by & order by queries", () => {
    test("200 - sorting by title returns the titles in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("200 - sort by author in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=ASC")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("author");
        });
    });
    test("404 - invalid sort by query", () => {
      return request(app)
        .get("/api/articles?sort_by=kiwi")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by");
        });
    });
    test("404 - invalid order by query", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order");
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("returns status 204 and deletes the comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("returns status 404 if the comment id cannot be found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Comment Found");
      });
  });
  test("returns status 400 if the comment id is invalid", () => {
    return request(app)
      .delete("/api/comments/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});

describe("GET /api/", () => {
  test("returns status 200 and the /api contents", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toMatchObject({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all topics",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                },
              ],
            },
          },
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("returns status 200 and receives back a user with username, avatar_url and name", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject([
          {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
        ]);
      });
  });
  test("returns status 404 and  returns user not found", () => {
    return request(app)
      .get("/api/users/bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("returns status 200 and increases the vote count", () => {
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send({ inc_votes: 1 })
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("returns status 400 bad request - invalid id", () => {
    return request(app)
      .patch("/api/comments/bananas")
      .expect(400)
      .send({ inc_votes: 1 })
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid ID" });
      });
  });
  test('Status: 404 "Not Found" - Comment does not exist', () => {
    return request(app)
      .patch("/api/comments/99999")
      .expect(404)
      .send({ inc_votes: 1 })
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found");
      });
  });
});

describe("POST /api/articles", () => {
  test("returns status 201 and creates the newly created article", () => {
    const newArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
    };
    return request(app)
      .post("/api/articles")
      .expect(201)
      .send(newArticle)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual({
          article_id: expect.any(Number),
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: expect.any(Number),
          topic: "mitch",
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });
  test("returns status 400 if username/title/body/topic is not provided", () => {
    const newArticle = {
      title: "frogs are amphibians",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("The Input is Invalid");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("returns status 204 and deletes the article", () => {
    return request(app)
      .delete("/api/articles/4")
      .expect(204)
      .then(({ body }) => {
        return body;
      });
  });
  test("returns status 404 if the path is invalid", () => {
    return request(app)
      .delete("/api/artiiccle/3")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found.");
      });
  });
  test("retirns status 404 if the article can not be found", () => {
    return request(app)
      .delete("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});
