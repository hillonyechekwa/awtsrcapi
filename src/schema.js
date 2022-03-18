const {gql} = require('apollo-server-express')

module.exports = gql`
	scalar DateTime

	type Runner{
		id: ID!
		content: String!
		runsDone: [Run!]!
		rate: Int!
		rating: Int
	}
	
	type Run{
	     id: ID!
	     content: String!
	     author: User!
		 runStatus: String!
		 runner: Runner!
		 createdAt: DateTime!
		 updatedAt: DateTime!
	}

	type User{
	     id: ID!
	     username: String!
	     email: String!
	     avatar: String!
	     runs: [Run!]!
		 role: String!
	}

	type Query{
	     runs: [Run!]!
	     run(id: ID!): Run!
		 runStatus(id: ID!): Run!
		 runner(id: ID!): Runner!
	     user(username: String): User
	     users: [User!]!
	     me: User!
	}

	type Mutation{
		newRun(content: String!): Run!
		updateRun(id: ID!, content: String!): Run!
		deleteRun(id: ID!): Boolean!
		signUp(username: String!, email: String!, password: String!): String!
		signIn(username: String!, email: String!, password: String!): String!
	}
`

