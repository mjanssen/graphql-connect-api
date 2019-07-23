const { isFloat } = require('./numbers');
const types = require('../types');

export function typeMapper(value: any, defaultType: string) {
  // If array, return []
  if (Array.isArray(value)) return '[]';

  // If number, return correct type
  if (typeof value === 'number') {
    return isFloat(value) ? 'Float' : 'Int';
  }

  // Check in the type mapping
  if (typeof types[typeof value] !== 'undefined') {
    return types[typeof value];
  }

  // Return default value
  return defaultType;
}
