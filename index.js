const conectarDB = require('./config/db');
const resolvers = require('./db/resolvers');
const typeDefs = require('./db/squema');
const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

// Conectar a la base de datos
conectarDB();

// Server
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => {
    const token = req.headers['authorization'] || '';
    if (token) {
        try {
            const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);

            return { usuario };
        } catch (error) {
            console.log(`Hubo un error: ${error}`)
        }
    }
}});

// Inicar el server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server running on port: ${url}`)
});