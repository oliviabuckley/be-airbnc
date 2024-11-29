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
  return properties.map((property) => {
    const hostId = userRef[property.host_name];
    delete property.host_name;
    return { ...property, host_id: hostId };
  });
};

const formatFavourites = (favourites, userRef, propertyRef) => {
  return favourites.map((favourite) => {
    const guestId = userRef[favourite.guest_name];
    const propertyId = propertyRef[favourite.property_name];
    delete favourite.guest_name;
    delete favourite.property_name;
    return { ...favourite, guest_id: guestId, property_id: propertyId };
  });
};

const formatReviews = (reviews, userRef, propertyRef) => {
  return reviews.map((review) => {
    const guestId = userRef[review.guest_name];
    const propertyId = propertyRef[review.property_name];
    delete review.guest_name;
    delete review.property_name;
    return { ...review, guest_id: guestId, property_id: propertyId };
  });
};

module.exports = {
  createUserRef,
  createPropertyRef,
  formatProperties,
  formatFavourites,
  formatReviews,
};
