const {ApolloServer} = require('apollo-server-express');
const {ApolloServerPluginDrainHttpServer} = require('apollo-server-core');
const express = require('express')
const http = require('http')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const models = require('./models')
const db = require('./db')
const port = process.env.PORT || 4000
const jwt = require('jsonwebtoken')
const DB_HOST = process.env.DB_HOST
require('dotenv').config()

const getUser = (token) => {
	if(token){
		try{
			return jwt.verify(token, process.env.JWT_SECRET)
		} catch(err) {
			throw new Error('Session Invalid!')
		}
	}
}


const startApolloServer = async (typeDefs, resolvers) =>{
	const app = express()
	const httpServer = http.createServer(app)
	db.connect(DB_HOST)
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({req}) => {
			const token = req.headers.authorization
			const user = getUser(token)

			return {models, user}
		},
		plugins: [ApolloServerPluginDrainHttpServer({httpServer})] })

	await server.start()
	server.applyMiddleware({app, path: '/api'});
	await new Promise(resolve => httpServer.listen({port}, resolve));
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
