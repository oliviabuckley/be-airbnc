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
            .expect(200)
            .then(({ body: { properties } }) => {
              expect(properties).toBeSortedBy("favourites", {
                descending: true,
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
            .then(({ body: { msg } }) => {
              expect(msg).toBe("host with ID 1000 not found");
            });
        });
      });
      describe("invalid methods", () => {
        test("405 - method not allowed", () => {
          const methods = ["delete", "post", "put", "patch"];
          return Promise.all(
            methods.map((method) => {
              return request(app)
                [method]("/api/properties")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed");
                });
            })
          );
        });
      });
    });
  });
  describe("/api/properties/:id", () => {
    describe("happy path", () => {
      describe("GET", () => {
        test("200 - responds with property object", () => {
          return request(app)
            .get(`/api/properties/1`)
            .expect(200)
            .then(({ body: { property } }) => {
              expect(typeof property).toBe("object");
            });
        });
        test("property object has the correct properties", () => {
          return request(app)
            .get("/api/properties/1")
            .then(({ body: { property } }) => {
              expect(property).toHaveProperty("property_id");
              expect(property).toHaveProperty("property_name");
              expect(property).toHaveProperty("location");
              expect(property).toHaveProperty("price_per_night");
              expect(property).toHaveProperty("host");
              expect(property).toHaveProperty("favourites");
              expect(property).toHaveProperty("host_avatar");
            });
        });
      });
    });
    describe("sad path", () => {
      describe("GET", () => {
        test("404 - property does not exist", () => {
          return request(app)
            .get("/api/properties/1000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("property with ID 1000 not found");
            });
        });
      });
      describe("invalid methods", () => {
        test("405 - method not allowed", () => {
          const methods = ["delete", "post", "put", "patch"];
          return Promise.all(
            methods.map((method) => {
              return request(app)
                [method]("/api/properties/:id")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed");
                });
            })
          );
        });
      });
    });
  });
  describe("api/properties/:id/reviews", () => {
    describe("happy path", () => {
      describe("GET", () => {
        test("200 - responds with an array of review objects", () => {
          const propertyId = 1;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .expect(200)
            .then(({ body: { propertyReviews } }) => {
              expect(Array.isArray(propertyReviews)).toBe(true);
              propertyReviews.forEach((propertyReview) => {
                expect(typeof propertyReview).toBe("object");
              });
            });
        });
        test("each review object has the correct properties", () => {
          const propertyId = 1;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .then(({ body: { propertyReviews } }) => {
              propertyReviews.forEach((propertyReview) => {
                expect(propertyReview).toHaveProperty("review_id");
                expect(propertyReview).toHaveProperty("comment");
                expect(propertyReview).toHaveProperty("rating");
                expect(propertyReview).toHaveProperty("created_at");
                expect(propertyReview).toHaveProperty("guest");
                expect(propertyReview).toHaveProperty("guest_avatar");
              });
            });
        });
        test("orders reviews by newest to oldest by default", () => {
          const propertyId = 1;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .expect(200)
            .then(({ body: { propertyReviews } }) => {
              expect(propertyReviews).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        test("response includes average rating", () => {
          const propertyId = 1;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .expect(200)
            .then(({ body }) => {
              expect(body).toHaveProperty("average_rating");
              expect(typeof body.average_rating).toBe("number");
              expect(body.average_rating).toBeCloseTo(
                parseFloat(body.average_rating),
                1
              );
            });
        });
        test("average rating is correct", () => {
          const propertyId = 1;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .expect(200)
            .then(({ body: { propertyReviews, average_rating } }) => {
              const expectedAvgRating =
                propertyReviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / propertyReviews.length;
              expect(average_rating).toBeCloseTo(expectedAvgRating, 1);
            });
        });
      });
      describe("POST", () => {
        test("201 - responds with the new review object", () => {
          const propertyId = 3;
          const propertyReview = {
            guest_id: 2,
            rating: 4,
            comment: "Great property!",
          };
          return request(app)
            .post(`/api/properties/${propertyId}/reviews`)
            .send(propertyReview)
            .expect(201)
            .then(({ body }) => {
              expect(body.guest_id).toBe(propertyReview.guest_id);
              expect(body.rating).toBe(propertyReview.rating);
              expect(body.comment).toBe(propertyReview.comment);
              expect(body.created_at).toBeDefined();
            });
        });
      });
    });
    describe("sad path", () => {
      describe("GET", () => {
        test("404 - property does not exist", () => {
          const propertyId = 10000000;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe(`property with ID ${propertyId} not found`);
            });
        });
        test("200 - no reviews for this property", () => {
          const propertyId = 2;
          return request(app)
            .get(`/api/properties/${propertyId}/reviews`)
            .expect(200)
            .then(({ body }) => {
              expect(body.msg).toBe(
                "there are no reviews for this property yet"
              );
            });
        });
      });
      describe("POST", () => {
        test("400 - missing required fields", () => {
          const propertyId = 1;
          const propertyReviewList = [
            {
              rating: 4,
              comment: "Great place!",
            },
            {
              guest_id: 2,
              comment: "Great place!",
            },
            {
              guest_id: 2,
              rating: 4,
            },
          ];
          return Promise.all(
            propertyReviewList.map((propertyReview) =>
              request(app)
                .post(`/api/properties/${propertyId}/reviews`)
                .send(propertyReview)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe("missing required fields");
                })
            )
          );
        });
        test("400 - rating must be between 1 and 5", () => {
          const propertyId = 1;
          const invalidRatings = [
            { guest_id: 2, rating: 6, comment: "Good review" },
            { guest_id: 2, rating: 0, comment: "Bad review" },
          ];
          return Promise.all(
            invalidRatings.map((invalidRating) =>
              request(app)
                .post(`/api/properties/${propertyId}/reviews`)
                .send(invalidRating)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe("rating must be between 1 and 5");
                })
            )
          );
        });
        test("400 - invalid guest id", () => {
          const propertyId = 1;
          const invalidGuestIdReview = {
            guest_id: 1000,
            rating: 4,
            comment: "Nice property!",
          };
          return request(app)
            .post(`/api/properties/${propertyId}/reviews`)
            .send(invalidGuestIdReview)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe(
                "guest with ID 1000 not found or not a guest"
              );
            });
        });
        test("400 - guest cannot review same property twice", () => {
          const propertyId = 1;
          const propertyReview = {
            guest_id: 2,
            rating: 4,
            comment: "Great property!",
          };
          return request(app)
            .post(`/api/properties/${propertyId}/reviews`)
            .send(propertyReview)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("guest has already reviewed this property");
            });
        });
      });
      describe("invalid methods", () => {
        test("405 - method not allowed", () => {
          const methods = ["delete", "put", "patch"];
          const propertyId = 1;
          return Promise.all(
            methods.map((method) => {
              return request(app)
                [method](`/api/properties/${propertyId}/reviews`)
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed");
                });
            })
          );
        });
      });
    });
  });
});
