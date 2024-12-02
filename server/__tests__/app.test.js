const app = require("../app");
const db = require("../../db/connection");
const seed = require("../../db/seed");
const users = require("../../db/data/test/users.json");
const propertyTypes = require("../../db/data/test/property-types.json");
const properties = require("../../db/data/test/properties.json");
const favourites = require("../../db/data/test/favourites.json");
const reviews = require("../../db/data/test/reviews.json");
const request = require("supertest");

beforeEach(() => {
  return seed(users, propertyTypes, properties, favourites, reviews);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  test("404 - path not found", () => {
    return request(app)
      .get("/invalid/endpoint")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
  describe("/api/properties", () => {
    describe("GET", () => {
      test("200 - responds with an array of property objects", () => {
        return request(app)
          .get("/api/properties")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.properties)).toBe(true);
            expect(body.properties.length).toBeGreaterThan(0);
            body.properties.forEach((property) => {
              expect(typeof property).toBe("object");
            });
          });
      });
      test("each property object has the correct properties", () => {
        return request(app)
          .get("/api/properties")
          .then(({ body }) => {
            body.properties.forEach((property) => {
              expect(property).toHaveProperty("property_id");
              expect(property).toHaveProperty("property_name");
              expect(property).toHaveProperty("location");
              expect(property).toHaveProperty("price_per_night");
              expect(property).toHaveProperty("host");
            });
          });
      });
      test("properties are ordered according to their number of favourites (highest to lowest)", () => {
        return request(app)
          .get("/api/properties")
          .then(({ body }) => {
            const favouritesCount = body.properties.map(
              (property) => property.favourites_count
            );
            const sortedFavouritesCount = [...favouritesCount].sort(
              (a, b) => b - a
            );
            expect(favouritesCount).toEqual(sortedFavouritesCount);
          });
      });
    });
    describe("DELETE", () => {
      test("405 - method not allowed", () => {
        return request(app).delete("/api/properties").expect(405);
      });
    });
  });
});
