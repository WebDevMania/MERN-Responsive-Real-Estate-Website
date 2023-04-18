Hello and welcome to my real estate project that has a functionality for people to list yachts as well.

Start Backend - npx nodemon
Start Client - npm run start

CLIENT ->
Routing is in the App.js file and App.css has some css to remove default values margin and padding and etc.
Redux is used only for authentication.
Components folder has several other folders inside which are comprised of 2 files: JSX & CSS.
Util folder is for utility functions mostly.
Pages that make the application what it is: -- Home page, Sign in & Sign up pages, Estate Catalog, Estate Details, Yacht Catalog, Yacht Details, My profile page, Update profile page.
If you wonder where are the list estate, yacht listing components as well as My profile page - Click your name on the right side of the navbar. A modal will pop up below it and you can see the texts navigating you to those pages.


BACKEND ->
Middlewares folder - I've defined a function which its only purpose is to check the validity of the JWT token
Models folder - I've written the schemas of the documents there
Controllers folder - I've defined the endpoint and the functions for the backend routes
Public folder - This folder holds the images 
Index.js file - Most of the middlewares and all of the routes are defined there.
