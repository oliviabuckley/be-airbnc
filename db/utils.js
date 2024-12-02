const createUserRef = (insertedUsers) => {
  const userRef = {};
  insertedUsers.forEach((user) => {
    const fullName = user.first_name + " " + user.surname;
    userRef[fullName] = user.user_id;
  });
  return userRef;
};

const createPropertyRef = (insertedProperties) => {
  const propertyRef = {};
  insertedProperties.forEach((property) => {
    propertyRef[property.name] = property.property_id;
  });
  return propertyRef;
};

const formatProperties = (properties, userRef) => {
  return properties.map(({ host_name, ...rest }) => {
    const hostId = userRef[host_name];
    return { ...rest, host_id: hostId };
  });
};

const formatFavourites = (favourites, userRef, propertyRef) => {
  return favourites.map(({ guest_name, property_name }) => {
    const guestId = userRef[guest_name];
    const propertyId = propertyRef[property_name];
    return { guest_id: guestId, property_id: propertyId };
  });
};

const formatReviews = (reviews, userRef, propertyRef) => {
  return reviews.map(({ guest_name, property_name, ...rest }) => {
    const guestId = userRef[guest_name];
    const propertyId = propertyRef[property_name];
    return { ...rest, guest_id: guestId, property_id: propertyId };
  });
};

module.exports = {
  createUserRef,
  createPropertyRef,
  formatProperties,
  formatFavourites,
  formatReviews,
};
