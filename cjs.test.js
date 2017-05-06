const funtch = require('./index');

funtch.get('https://api.vibioh.fr/hello/funtch').then(console.log);

console.log(funtch.contentHandler);
