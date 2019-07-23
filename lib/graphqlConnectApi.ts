export interface optsInterface {
  type: string;
  params?: string[];
  isIterable?: boolean;
  headers?: object;
  defaultType?: string;
  iterable?: string[];
}

export interface typeDefInterface {
  type: string;
  params: string[];
  headers: object;
  isIterable: boolean;
  defaultType: string;
  iterable: string[];
}

const axios = require('axios');
const buildTypeDef = require('./queryBuilder');

class graphqlConnectApi {
  storage = new Map();

  connectApi = async (url: string, opts: optsInterface) => {
    const {
      type,
      isIterable = false,
      params = [],
      defaultType = 'String',
      headers = {},
      iterable = [],
    } = opts;

    const queryData = await buildTypeDefAndResolvers(this.storage, url, {
      type,
      isIterable,
      defaultType,
      headers,
      iterable,
      params,
    });

    this.storage.set(url, queryData);
  };

  generate = () => {
    const typeDefs: Array<string> = [];
    let queries = { Query: {} };
    this.storage.forEach(g => {
      typeDefs.push(g.typeDef);
      queries = { Query: { ...queries.Query, ...g.resolvers } };
    });

    return {
      resolvers: queries,
      typeDefs: [`type Query { _: Boolean } `, ...typeDefs],
    };
  };
}

function buildTypeDefAndResolvers(storage, url: string, opts: typeDefInterface) {
  const { headers } = opts;

  return axios
    .get(url, {
      headers: {
        accept: 'application/json',
        ...headers,
      },
    })
    .then(res => buildTypeDef(res, storage, url, opts))
    .catch(e => {
      console.log(`Fetch failed for '${url}': ${e.message}`);
    });
}

module.exports = new graphqlConnectApi();
