/* eslint-disable eqeqeq */
'use strict';

// const maps = require('../assets/maps.json');
// const campaigns = require('../assets/campaigns.json');

export const sortMapsFunc = (field, asc, field2, asc2) => (a,b) => {
  if( a[field] !== b[field] ) {
    if( asc ) { [a, b] = [b, a]; }
    return typeof a[field] === 'string'
      ? a[field].localeCompare( b[field] )
      : b[field] - a[field];
  } else {
    if( asc2 ) { [a, b] = [b, a]; }
    return typeof a[field2] === 'string'
      ? a[field2].localeCompare( b[field2] )
      : b[field2] - a[field2];
  }
};

export const filterMapsFunc = (field, compType, value) => (m) => {
  switch( compType ) {
    case '=':
      return m[field] == value;
    case '!=':
    case '<>':
      return m[field] != value;
    case '>':
      return m[field] > value;
    case '<':
      return m[field] > value;
    case '>=':
      return m[field] >= value;
    case '<=':
      return m[field] <= value;
    default:
      throw new Error(`Unknown comparison "${compType}".`);
  }
};


module.export = {
//export default {
  filterMapsFunc,
  sortMapsFunc,

  // maps,
  // campaigns,

};
