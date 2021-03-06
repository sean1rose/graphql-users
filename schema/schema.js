// SCHEMA tells graphql exactly what our data looks like, what properties each obj has, and how each obj is related to each other

const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
	GraphQLNonNull
} = graphql;

// make sure this is declared b4 UserType

  // associate CompanyType w/ a User
    // add as a FIELD on UserType below
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () =>  ({
    id: { type: GraphQLString },
    name: { type: GraphQLString},
    description: { type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        // make request to JSON server API to get reference to current company (via parentValue)
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

// represents User obj, and what the obj will look like -> defines data and r/s's
  // fields prop: tells graphql about all the diff props a user has
  // tell graphql the type of data (number, string, array) each field is 
  // every user has 3 properties...
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () =>  ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // tell server WHERE and HOW to fetch the data for each data type - each has a clear responsibility for fetching items of just 1 type
        // https://dev-blog.apollodata.com/graphql-explained-5844742f195e#.mpsjqan8l
        // schema tells server what queries clients can make and how they're related
          // resolve tells server WHERE the data for each type COMES FROM
            // answer: "How do I get data for Users/Companies?"
        // somehow want to return the company associated w/ the given user from this resolve function
        // console.log(parentValue, args);
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
          
      }
    }
  })
});
// note that company's type is 'CompanyType'

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
        // want to return data that represents the user obj w/ a given id (return raw JS)
        
        // async request to json server
        // if return promise -> graphql will detect and wait for it to resolve, grab data resolved from db and send back to user
          // request to localhost:3000/users/:id
        // reaching out to 3rd party service
        // since resolve can handle a promise, can fetch data from anywhere (3rd party server, hard drive, API, etc)...
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);

      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        // go out and find particular company and return it...
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

// all your mutation functions will end up on the "fields" object-property...
const mutation = new GraphQLObjectType({
  name: 'Mutation',
    fields: {
  		addUser: {
  			type: UserType,
				args: {
  				firstName: { type: new GraphQLNonNull(GraphQLString) },
					age: { type: new GraphQLNonNull(GraphQLInt) },
					companyId: { type: GraphQLString }
				},
				resolve(parentValue, {firstName, age}) {
					// in a mutation, resolve is where we undergo the operation of creating the new piece of data in the DB
					return axios.post(`http://localhost:3000/users`, { firstName, age })
						.then(res => res.data);
				}
			},
			deleteUser: {
				type: UserType,
				args: {
					id: { type: new GraphQLNonNull(GraphQLString)  }
				},
				resolve(parentValue, { id }) {
					return axios.delete(`http://localhost:3000/users/${id}`)
						.then(res => res.data);
				}
			},
			editUser: {
  			type: UserType,
				args: {
  				id: { type: new GraphQLNonNull(GraphQLString) },
					firstName: { type: GraphQLString },
					age: { type: GraphQLInt }
				},
				resolve(parentValue, args) {
  				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
						.then(res => res.data);
				}
			}
    }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
	mutation
});