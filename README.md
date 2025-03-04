# Airbnc 🏡

This project is a backend implementation for a platform similar to Airbnb, designed to allow users to view a list property rentals which are available to book.

# Deployment

This project is hosted and you can view the live app here: https://be-airbnc.onrender.com.

# Features

- **Property Listings**: Retrieve a list of available properties along with their details, such as name, location and price.
- **Property Details**: Get detailed information about a specific property, including its name, location and description.

- **Property Reviews**:

  - **View Reviews**: View all reviews for a specific property, including ratings and comments.
  - **Add a Review**: Post a review for a property, including a rating and a comment.

- **User Management**:

  - **Get User Details**: Retrieve information about a user.
  - **Update User Details**: Update the user's profile.

- **Favourites**:

  - **Get User Favourites Favourites**: Retrieve a user's favourites list.
  - **Add Property to Favourites**: Add a property to the user's favourites list.
  - **Remove Property from Favourites**: Remove a property from the user's favourites list.

- **Flexible API Endpoints**: The platform supports various API routes for retrieving and manipulating property, review, user, and favourite data.

## Project setup

- Run `npm install` in the root of repo to install the necessary dependencies.

- Create a `.env.test` file at the root level with the following content:

```
PGDATABASE=airbnc_test
```

- Run `npm run setup-db` to create the local test database.

- Run `npm run seed` to seed the test database.

- Run `npm test` to seed the test database and test the project functionalities.
