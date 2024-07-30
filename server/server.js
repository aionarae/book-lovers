const express = require('express');
// import ApolloServer
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
// import authMiddleware function
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Create a new instance of ApolloServer with GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlenconded({ extended: true }));
  app.use(express.json());

  // Use graphql server as middleware
  app.use('/graphql', expressMiddleware(server,{
    context: authMiddleware,
  } )); 

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

// Start the Apollo Server
startApolloServer();