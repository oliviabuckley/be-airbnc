const { createRef, formatProperties } = require("../utils");

describe("createRef", () => {
  test("returns object", () => {
    const users = [{ first_name: "Alice", surname: "Johnson", user_id: 1 }];
    const ref = createRef(users);
    expect(ref).toEqual({
      "Alice Johnson": 1,
    });
  });
  test("assigns the correct user_id to each user's full name", () => {
    const users = [{ first_name: "Alice", surname: "Johnson", user_id: 1 }];
    const ref = createRef(users);
    expect(ref["Alice Johnson"]).toBe(1);
  });
  test("assigns the number of properties as there are objects in the array", () => {
    const users = [
      { first_name: "Alice", surname: "Johnson", user_id: 1 },
      { first_name: "Emma", surname: "Davis", user_id: 3 },
      { first_name: "Isabella", surname: "Martinez", user_id: 5 },
    ];
    const ref = createRef(users);
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
    createRef(users);
    expect(users).toEqual(usersCopy);
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
    const originalProperties = [...properties];
    formatProperties(properties, userRef);
    expect(properties).toEqual(originalProperties);
  });
});
