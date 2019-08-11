const funtch = require('./bundle');

Object.keys(funtch).filter(key => key !== 'default').reduce((previous, current) => {
  // eslint-disable-next-line no-param-reassign
  previous[current] = funtch[current];
  return previous;
}, funtch.default);

module.exports = funtch.default;
