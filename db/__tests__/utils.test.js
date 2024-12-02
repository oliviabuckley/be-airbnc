const {
  createUserRef,
  createPropertyRef,
  formatProperties,
  formatFavourites,
  formatReviews,
} = require("../utils");

describe("createUserRef", () => {
  test("returns object", () => {
    const users = [{ first_name: "Alice", surname: "Johnson", user_id: 1 }];
    const ref = createUserRef(users);
    expect(ref).toEqual({
      "Alice Johnson": 1,
    });
  });
  test("assigns the correct user_id to each user's full name", () => {
    const users = [{ first_name: "Alice", surname: "Johnson", user_id: 1 }];
    const ref = createUserRef(users);
    expect(ref["Alice Johnson"]).toBe(1);
  });
  test("assigns the number of properties as there are objects in the array", () => {
    const users = [
      { first_name: "Alice", surname: "Johnson", user_id: 1 },
      { first_name: "Emma", surname: "Davis", user_id: 3 },
      { first_name: "Isabella", surname: "Martinez", user_id: 5 },
    ];
    const ref = createUserRef(users);
    expect(Object.keys(ref)).toHaveLength(3);
    expect(ref["Alice Johnson"]).toBe(1);
    expect(ref["Emma Davis"]).toBe(3);
    expect(ref["Isabella Martinez"]).toBe(5);
  });
  test("doesn't mutate original input", () => {
    const users = [
      { first_name: "Alice", surname: "Johnson", user_id: 1 },
      { first_name: "Emma", surname: "Davis", user_id: 3 },
      { first_name: "Isabella", surname: "Martinez", user_id: 5 },
    ];
    const usersCopy = [...users];
    createUserRef(users);
    expect(users).toEqual(usersCopy);
  });
});

describe("createPropertyRef", () => {
  test("returns an object", () => {
    const properties = [
      { name: "Modern Apartment in City Center", property_id: 1 },
    ];
    const ref = createPropertyRef(properties);
    expect(ref).toEqual({
      "Modern Apartment in City Center": 1,
    });
  });
  test("assigns the correct property_id to each property's name", () => {
    const properties = [
      { name: "Modern Apartment in City Center", property_id: 1 },
    ];
    const ref = createPropertyRef(properties);
    expect(ref["Modern Apartment in City Center"]).toBe(1);
  });
  test("assigns the number of properties as there are objects in the array", () => {
    const properties = [
      { name: "Modern Apartment in City Center", property_id: 1 },
      { name: "Cosy Family House", property_id: 2 },
      { name: "Chic Studio Near the Beach", property_id: 3 },
    ];
    const ref = createPropertyRef(properties);
    expect(Object.keys(ref)).toHaveLength(3);
    expect(ref["Modern Apartment in City Center"]).toBe(1);
    expect(ref["Cosy Family House"]).toBe(2);
    expect(ref["Chic Studio Near the Beach"]).toBe(3);
  });
  test("does not mutate the original input", () => {
    const properties = [
      { name: "Modern Apartment in City Center", property_id: 1 },
      { name: "Cosy Family House", property_id: 2 },
      { name: "Chic Studio Near the Beach", property_id: 3 },
    ];
    const propertiesCopy = [...properties];
    createPropertyRef(properties);
    expect(properties).toEqual(propertiesCopy);
  });
});

describe("formatProperties", () => {
  test("returns an array", () => {
    const properties = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
      },
    ];
    const userRef = { "Alice Johnson": 1 };
    const formattedProperties = formatProperties(properties, userRef);
    expect(Array.isArray(formattedProperties)).toBe(true);
  });
  test("removes host_name from each property object", () => {
    const properties = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
      },
    ];
    const userRef = { "Alice Johnson": 1 };
    const formattedProperties = formatProperties(properties, userRef);
    expect(formattedProperties[0]).not.toHaveProperty("host_name");
  });
  test("host_id has value from refObj", () => {
    const properties = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
      },
    ];
    const userRef = {
      "Alice Johnson": 1,
    };
    const formattedProperties = formatProperties(properties, userRef);
    expect(formattedProperties[0].host_id).toBe(1);
  });
  test("formats multiple properties correctly", () => {
    const properties = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
      },
      {
        name: "Elegant City Apartment",
        property_type: "Apartment",
        location: "Birmingham, UK",
        price_per_night: 110.0,
        description: "Description of Elegant City Apartment.",
        host_name: "Emma Davis",
      },
    ];
    const userRef = {
      "Alice Johnson": 1,
      "Emma Davis": 3,
    };
    const formattedProperties = formatProperties(properties, userRef);
    expect(formattedProperties[0]).toHaveProperty("host_id", 1);
    expect(formattedProperties[0]).not.toHaveProperty("host_name");
    expect(formattedProperties[1]).toHaveProperty("host_id", 3);
    expect(formattedProperties[1]).not.toHaveProperty("host_name");
  });
  test("does not mutate raw data", () => {
    const properties = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
      },
    ];
    const userRef = { "Alice Johnson": 1 };
    const originalProperties = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
      },
    ];
    formatProperties(properties, userRef);
    expect(properties).toEqual(originalProperties);
  });
});

describe("formatFavourites", () => {
  test("returns an array", () => {
    const favourites = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
    ];
    const userRef = { "Bob Smith": 1 };
    const propertyRef = { "Modern Apartment in City Center": 1 };
    const formattedFavourites = formatFavourites(
      favourites,
      userRef,
      propertyRef
    );
    expect(Array.isArray(formattedFavourites)).toBe(true);
  });
  test("removes guest_name from each favourite object", () => {
    const favourites = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
    ];
    const userRef = { "Bob Smith": 1 };
    const propertyRef = { "Modern Apartment in City Center": 1 };
    const formattedFavourites = formatFavourites(
      favourites,
      userRef,
      propertyRef
    );
    expect(formattedFavourites[0]).not.toHaveProperty("guest_name");
  });
  test("adds guest_id with value from userRef and property_id with value from propertyRef", () => {
    const favourites = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
    ];
    const userRef = { "Bob Smith": 1 };
    const propertyRef = { "Modern Apartment in City Center": 1 };
    const formattedFavourites = formatFavourites(
      favourites,
      userRef,
      propertyRef
    );
    expect(formattedFavourites[0]).toHaveProperty("guest_id", 1);
    expect(formattedFavourites[0]).toHaveProperty("property_id", 1);
  });
  test("formats multiple favourites correctly", () => {
    const favourites = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
      { guest_name: "Rachel Cummings", property_name: "Cosy Family House" },
    ];
    const userRef = {
      "Bob Smith": 1,
      "Rachel Cummings": 2,
    };
    const propertyRef = {
      "Modern Apartment in City Center": 1,
      "Cozy Family House": 2,
    };
    const formattedFavourites = formatFavourites(
      favourites,
      userRef,
      propertyRef
    );
    expect(formattedFavourites[0]).toHaveProperty("guest_id", 1);
    expect(formattedFavourites[0]).not.toHaveProperty("guest_name");
    expect(formattedFavourites[1]).toHaveProperty("guest_id", 2);
    expect(formattedFavourites[1]).not.toHaveProperty("guest_name");
  });
  test("does not mutate raw data", () => {
    const favourites = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
    ];
    const userRef = { "Bob Smith": 1 };
    const propertyRef = { "Modern Apartment in City Center": 1 };
    const originalFavourites = [
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
      },
    ];
    formatFavourites(favourites, userRef, propertyRef);
    expect(favourites).toEqual(originalFavourites);
  });
});

describe("formatReviews", () => {
  test("returns an array", () => {
    const reviews = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Great location and cosy space, perfect for a beach getaway.",
      },
    ];
    const userRef = { "Frank White": 1 };
    const propertyRef = { "Chic Studio Near the Beach": 1 };
    const formattedReviews = formatReviews(reviews, userRef, propertyRef);
    expect(Array.isArray(formattedReviews)).toBe(true);
  });
  test("removes guest_name and property_name from each review object", () => {
    const reviews = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Great location and cosy space, perfect for a beach getaway.",
      },
    ];
    const userRef = { "Frank White": 1 };
    const propertyRef = { "Chic Studio Near the Beach": 1 };
    const formattedReviews = formatReviews(reviews, userRef, propertyRef);
    expect(formattedReviews[0]).not.toHaveProperty("guest_name");
    expect(formattedReviews[0]).not.toHaveProperty("property_name");
  });
  test("adds guest_id with value from userRef and property_id with value from propertyRef", () => {
    const reviews = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Great location and cosy space, perfect for a beach getaway.",
      },
    ];
    const userRef = { "Frank White": 1 };
    const propertyRef = { "Chic Studio Near the Beach": 1 };
    const formattedReviews = formatReviews(reviews, userRef, propertyRef);
    expect(formattedReviews[0]).toHaveProperty("guest_id", 1);
    expect(formattedReviews[0]).toHaveProperty("property_id", 1);
  });
  test("formats multiple reviews correctly", () => {
    const reviews = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Great location and cosy space, perfect for a beach getaway.",
      },
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
        rating: 2,
        comment:
          "Too noisy at night, and the apartment felt cramped. Wouldn’t stay again.",
      },
    ];
    const userRef = { "Frank White": 1, "Bob Smith": 2 };
    const propertyRef = {
      "Chic Studio Near the Beach": 1,
      "Modern Apartment in City Center": 2,
    };
    const formattedReviews = formatReviews(reviews, userRef, propertyRef);
    expect(formattedReviews[0]).toHaveProperty("guest_id", 1);
    expect(formattedReviews[0]).toHaveProperty("property_id", 1);
    expect(formattedReviews[1]).toHaveProperty("guest_id", 2);
    expect(formattedReviews[1]).toHaveProperty("property_id", 2);
  });
  test("does not mutate raw data", () => {
    const reviews = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Great location and cosy space, perfect for a beach getaway.",
      },
    ];
    const userRef = { "Frank White": 1 };
    const propertyRef = { "Chic Studio Near the Beach": 1 };
    const originalReviews = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Great location and cosy space, perfect for a beach getaway.",
      },
    ];
    formatReviews(reviews, userRef, propertyRef);
    expect(reviews).toEqual(originalReviews);
  });
});
