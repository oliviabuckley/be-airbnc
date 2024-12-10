exports.fetchUserByIdQuery = `
  SELECT * 
  FROM users
  WHERE users.user_id = $1
`;
