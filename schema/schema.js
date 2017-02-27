// SCHEMA tells graphql exactly what our data looks like, what properties each obj has, and how each obj is related to each other

const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

// represents User obj, and what the obj will look like -> defines data and r/s's
  // fields prop: tells graphql about all the diff props a user has
  // tell graphql the type of data (number, string, array) each field is 
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
})