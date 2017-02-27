// SCHEMA tells graphql exactly what our data looks like, what properties each obj has, and how each obj is related to each other

const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

// hardcoded datastore...
const users = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '47', firstName: 'Samantha', age: 21}
]

// represents User obj, and what the obj will look like -> defines data and r/s's
  // fields prop: tells graphql about all the diff props a user has
  // tell graphql the type of data (number, string, array) each field is 
  // every user has 3 properties...
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

// entry pt into our data, allows graphql to jump and land onto a specific node in our data -> points us to a particular record in our graph of data
  // our root query is expecting an ID
  // ask me about users in the app, if u give me the id of the user you're looking for, i will return a user back to you (args is short for req'd arguments of the root query)
  // ***resolve func - goes into DATABASE and FINDS ACTUAL DATA we're looking for.  
    // parentValue - not really used
    // args - obj of args passed into original query (if query expects id, then id is present on args obj)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        // want to return a particular user w/ a given id
        // using hardcoded list...
        // walking thru list of users and find and return 1st user w/ id === args.id
        return _.find(users, { id: args.id });
      }
    }
  }
})