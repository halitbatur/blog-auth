# Blog app authentication

In this lab, you are required to implement authentication. This is to implement 2 functions:

- Sign in function
- Sign up function

## Sign in function

Open the file `server/routes/auth.js` and implement the `POST /signin` handler function. The sign in tests will check that:

- The app works
- The app can successfully sign in a user
- The app can handle wrong username
- The app can handle wrong password

### To sign in a user successfully you need to

- **redirect** the user to '/user/authenticated'
- include a **header** `user` with a value equal to logged in user id

### To handle a wrong username

- Respond with a status code 400
- Your response should contain an error message _wrong username or password_

### To handle a wrong password

- Respond with a status code 400
- Your response should contain an error message _wrong username or password_

> 💡 TIP: The app is setup to render error messages correctly. Simply pass the error message to the rended function `res.render(TEMPLATE, {error: "Your error message"})`

## Sign up function

Open the file `server/routes/auth.js` and implement the `POST /signup` handler function. The sign up tests will check that:

- The app works
- The app can successfully sign up a user
- The app hashes a password with `bcrypt`
- The app can handle used usernames
- The app can handle not matching password and confirmation password

### To sign up a user successfully you need to

- Add the user correctly to the database using the `User` model
- **redirect** the user to '/user/authenticated'

### To correctly hash password

- The user in database shouldn't have a plain text password
- Use bcrypt to hash passwords

### To handle used username

- Respond with a status code 400
- Your response should contain an error message _username already used_

### To handle not matching passwords

- Respond with status code 400
- Your response should contain an error message _passwords don't match_

## Working with docker

This app is bootstraped with docker and docker-compose. It containerize the server, as well as the database. The database comes with predefined data for testing purposes.

### To start the server

run the command `yarn && yarn start`. This will install all the dependencies and build the docker image

### To run the tests

run the command `yarn test`. Make sure that the server is up and running as well as the database

### To install packages

when you run `yarn add PACKAGE` the package will be installed in docker as well automatically. However if you run into issues, you need to stop the server first with `yarn run stop` then you can run `yarn run build` to rebuild the docker image and start again.

### To prune the containers and data

> ⚠️ WARNING: This is a destructuve command that would delete the containers and all the data inside like database data, and uploads

you can run `yarn run prune` to shutdown the server and delete all the volumes associated with it. This serves as a start fresh command, that will return your server environment to original. It will not affect your code changes though.
