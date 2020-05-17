import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(sink => {
  // Code to run on every request.
  sink.renderIntoElementById(
    "server-render-target",
    `Server time: ${new Date}`
  );
});

//Set up the Apollo server:
import { ApolloServer, gql } from 'apollo-server-express';
import { WebApp } from 'meteor/webapp';
import { getUser } from 'meteor/apollo';

// Load all your resolvers and type definitions into graphql-loader
import typeDefs from '/imports/api/graphql/schema';
import resolvers from '/imports/api/graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization)
  })
});

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: '/apollo/gql'
});

WebApp.connectHandlers.use('/apollo/gql', (req, res) => {
  if (req.method === 'GET') {
    res.end()
  }
});
