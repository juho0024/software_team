# Survey Maker App

This is a full stack application that uses the MERN Stack.  The application allows users to make surveys and distribute them.  Users can also view survey results and edit their surveys.

To view this app, please click [here](https://www.surveymaker.app).

The following technologies are used in this app:

## Server-Side Technologies
- Node.js
- Express
- MongoDB
- Mongoose

## Authentication
- Auth0

## Frontend Technologies
- React
- Javascript
- Bootstrap

## Set Up for Local Development
1. Clone this repo.  
   
2. `npm install`
   
3. Create an account with Auth0 and create a single page application.  Make sure to fill out all required fields. Use information from the application on Auth0 to fill out .env file and index.js on frontend.

4. Create an account on MongoDB Atlas.  Then create a new database.  Get a uri to connect to the database.  Use this to fill out the .env file. 
   
5. Add a .env file in the root of the repo with the following variables:

    - NODE_ENV
    - PORT
    - MONGO_URI
    - AUTH0_DOMAIN
    - AUTH0_CLIENT_ID
    - AUTH0_CLIENT_SECRET
  
6. Add a .env file in the root of the frontend/inventory-app folder.  Add the following variable:

    - REACT_APP_NODE_ENV = 'development'
  
7. In index.js in the frontend/inventory-app folder, change the clientId and domain in the Auth0Provider function.  You can get this information from your app on Auth0.
   
8. In constants.js in the frontend/inventory-app folder, you will need to change the url for production for the prodRedirectUri variable to whatever url you will use to redirect users to after login.  It should be in the form of "[insertUrlhere]/dashboard"
   

9.  `npm run dev` to launch the application 


