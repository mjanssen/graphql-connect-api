const { ApolloServer } = require('apollo-server');
const graphqlConnectApi = require('../lib/graphqlConnectApi');

const start = async () => {
  await graphqlConnectApi.connectApi('https://icanhazdadjoke.com/', { type: 'Joke' });

  const { resolvers, typeDefs } = graphqlConnectApi.generate();

  const server = new ApolloServer({ typeDefs, resolvers });

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

function initApollo() {}

start();
