const result = require('dotenv');

if (result.error) {
  throw result.error;
}

console.log(result.parsed);
