const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

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
});

describe("GET /api/articles/:article_id", () => {
  test("it should return the article and status 200", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        console.log(article);
        const result = {
          article_id: expect.any(Number),
          title: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
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
        expect(body.newComment).toMatchObject({
          article_id: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("returns status 400 if body or username is not provided", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send(newComment)
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
});
