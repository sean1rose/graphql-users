// pull in express module
const express = require('express');

// pull in express-graphql glue layer
const expressGraphQL = require('express-graphql');

// create express app
const app = express();

// graphql middleware
  // schema tells our server what our data is and its r/s's
app.use('/graphql', expressGraphQL({
  graphiql: true
}));

// tell app to listen to port 4000
app.listen(4000, () => {
  console.log('Listening on port 4000');
})