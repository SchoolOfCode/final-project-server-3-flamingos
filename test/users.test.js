const request = require("supertest");

const app = require("../app");

describe("GET /users", () => {
  it.skip(`should respond with 200 success`, done => {
    request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("POST /users", function() {
  let data = {
    phone: "+447555667799"
  };
  it("should respond with 307, user exists", function(done) {
    request(app)
      .post("/users")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(307)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});
