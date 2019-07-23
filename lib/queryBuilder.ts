export interface typeDefInterface {
  type: string;
  params: string[];
  headers: object;
  isIterable: boolean;
  defaultType: string;
  iterable: string[];
}

const axios = require('axios');
const { ucFirst } = require('./utils/strings');
const { typeMapper } = require('./utils/typeMapper');

module.exports = function buildTypeDef(res, storage, url, opts: typeDefInterface) {
  const { type, isIterable, defaultType, iterable, params, headers } = opts;

  let additionalTypes = '';
  let typeDef = `type ${type} { `;

  Object.entries(res.data).forEach(([k, v]) => {
    /**
     * Check if key is defined in the iterable array
     * If so, fill the additionalTypes
     */
    if (iterable.indexOf(k) > -1) {
      const typeName = ucFirst(k);
      additionalTypes += `type ${typeName} { `;
      Object.entries(v[0]).forEach(([iterableKey, iterableValue]) => {
        additionalTypes += `${iterableKey}: ${typeMapper(iterableValue, defaultType)} `;
      });

      additionalTypes += '}\n';

      return (typeDef += `${k}: [${typeName}]`);
    }

    typeDef += `${k}: ${typeMapper(v, defaultType)} `;
  });

  typeDef += ' }\n';

  const queryParams = params.length ? `(${params.map(p => `${p}: String`).join(',')})` : '';

  typeDef += `extend type Query {
    ${type}${queryParams}: ${isIterable ? `[${type}]` : type}\n}\n`;

  const gg = `${additionalTypes}\n${typeDef}`;

  const resolvers = buildResolvers(type, url, headers);
  const result = { typeDef: gg, resolvers };

  return result;
};

function buildResolvers(type: string, url: string, headers: object) {
  const u = url.split('?')[0];
  const query = {
    [type]: async (_, args) => {
      const res = await axios.get(`${u}`, {
        headers: {
          accept: 'application/json',
          ...headers,
        },
        params: args,
      });
      return res.data;
    },
  };

  return query;
}
