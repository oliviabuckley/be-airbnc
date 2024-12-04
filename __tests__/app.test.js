const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seed");
const users = require("../db/data/test/users.json");
const propertyTypes = require("../db/data/test/property-types.json");
const properties = require("../db/data/test/properties.json");
const favourites = require("../db/data/test/favourites.json");
const reviews = require("../db/data/test/reviews.json");
const request = require("supertest");
require("jest-extended");

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
    describe("happy path", () => {
      describe("GET", () => {
        test("200 - responds with an array of property objects", () => {
          return request(app)
            .get("/api/properties")
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(Array.isArray(properties)).toBe(true);
              expect(properties.length).toBeGreaterThan(0);
              properties.forEach((property) => {
                expect(typeof property).toBe("object");
              });
            });
        });
        test("each property object has the correct properties", () => {
          return request(app)
            .get("/api/properties")
            .then(({ body: { properties } }) => {
              properties.forEach((property) => {
                expect(property).toHaveProperty("property_id");
                expect(property).toHaveProperty("property_name");
                expect(property).toHaveProperty("location");
                expect(property).toHaveProperty("price_per_night");
                expect(property).toHaveProperty("host");
                expect(property).toHaveProperty("favourites");
              });
            });
        });
        test("properties are ordered by favourites (most to least) by default", () => {
          return request(app)
            .get("/api/properties")
            .then(({ body: { properties } }) => {
              properties.forEach((property) => {
                property.favourites = Number(property.favourites);
                expect(properties).toBeSortedBy("favourites", {
                  descending: true,
                });
              });
            });
        });
        describe("properties - optional queries", () => {
          test("200 - responds with all properties less than or equal to maxPrice", () => {
            return request(app)
              .get("/api/properties?maxPrice=150")
              .expect(200)
              .then(({ body: { properties } }) => {
                properties.forEach((property) => {
                  expect(Number(property.price_per_night)).toBeLessThanOrEqual(
                    150
                  );
                });
              });
          });
          test("200 - responds with all properties greater than or equal to minPrice", () => {
            return request(app)
              .get("/api/properties?minPrice=100")
              .expect(200)
              .then(({ body: { properties } }) => {
                properties.forEach((property) => {
                  expect(
                    Number(property.price_per_night)
                  ).toBeGreaterThanOrEqual(100);
                });
              });
          });
          test("200 - responds with all properties between minPrice and maxPrice", () => {
            const minPrice = 100;
            const maxPrice = 150;
            return request(app)
              .get(`/api/properties?minPrice=100&maxPrice=200`)
              .expect(200)
              .then(({ body: { properties } }) => {
                properties.forEach((property) => {
                  expect(
                    Number(property.price_per_night)
                  ).toBeGreaterThanOrEqual(100);
                  expect(Number(property.price_per_night)).toBeLessThanOrEqual(
                    200
                  );
                });
              });
          });
          test("200 - sorts properties by price_per_night", () => {
            return request(app)
              .get("/api/properties?sortBy=price_per_night")
              .expect(200)
              .then(({ body: { properties } }) => {
                expect(properties).toBeSortedBy("price_per_night", {
                  descending: true,
                  coerce: true,
                });
              });
          });
          test("200 - sorts properties by location", () => {
            return request(app)
              .get("/api/properties?sortBy=location")
              .expect(200)
              .then(({ body: { properties } }) => {
                expect(properties).toBeSortedBy("location", {
                  descending: true,
                  coerce: true,
                });
              });
          });
          test("200 - sorts properties by favourites", () => {
            return request(app)
              .get("/api/properties?sortBy=favourites")
              .expect(200)
              .then(({ body: { properties } }) => {
                expect(properties).toBeSortedBy("favourites", {
                  descending: true,
                  coerce: true,
                });
              });
          });
          test("200 - orders properties (descending)", () => {
            return request(app)
              .get("/api/properties?order=DESC")
              .expect(200)
              .then(({ body: { properties } }) => {
                expect(properties).toBeSortedBy("favourites", {
                  descending: true,
                  coerce: true,
                });
              });
          });
          test("200 - orders properties (ascending)", () => {
            return request(app)
              .get("/api/properties?order=ASC")
              .expect(200)
              .then(({ body: { properties } }) => {
                expect(properties).toBeSortedBy("favourites", {
                  coerce: true,
                });
              });
          });
          test("200 - filters properties by host_id", () => {
            return request(app)
              .get("/api/properties?host=1")
              .expect(200)
              .then(({ body: { properties } }) => {
                properties.forEach((property) => {
                  expect(property).toHaveProperty("host", "Alice Johnson");
                });
              });
          });
        });
      });
      describe("DELETE", () => {
        test("405 - method not allowed", () => {
          return request(app).delete("/api/properties").expect(405);
        });
      });
    });
    describe("sad path", () => {
      describe("GET", () => {
        test("400 - invalid maxPrice", () => {
          return request(app)
            .get("/api/properties?maxPrice=NaN")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("maxPrice must be a number");
            });
        });
        test("400 - invalid minPrice", () => {
          return request(app)
            .get("/api/properties?minPrice=NaN")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("minPrice must be a number");
            });
        });
        test("400 - invalid sortBy column", () => {
          return request(app)
            .get("/api/properties?sortBy=invalidSortByColumn")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("invalid sortBy or order");
            });
        });
        test("400 - invalid order value", () => {
          return request(app)
            .get("/api/properties?order=invalidOrderValue")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("invalid sortBy or order");
            });
        });
        test("404 - host does not exist", () => {
          return request(app)
            .get("/api/properties?host=1000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("host with ID 1000 not found");
            });
        });
      });
    });
  });
});
