const createRef = (insertedUsers) => {
  const userRef = {};
  insertedUsers.forEach((user) => {
    const fullName = user.first_name + " " + user.surname;
    userRef[fullName] = user.user_id;
  });
  return userRef;
};

const formatProperties = (properties, userRef) => {
  return properties.map((property) => {
    const hostId = userRef[property.host_name];
    delete property.host_name;
    return { ...property, host_id: hostId };
  });
};

module.exports = { createRef, formatProperties };
