const request = require("supertest");
const app = require("../app");

describe("POST /route to make a new post", function() {
  let data = {
    userId: "5cc9a890fca4c228a06046e5",
    username: "",
    imageUrl: "", //url
    imageId: "",
    description: "test post",
    longitude: 33.0,
    latitute: -33.0,
    postCategory: ""
  };
  it("should respond with 201 new post created", function(done) {
    request(app)
      .post("/posts")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});
