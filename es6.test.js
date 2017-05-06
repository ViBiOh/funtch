import funtch, { contentHandler } from './browser';

funtch.get('https://api.vibioh.fr/hello/funtch').then(console.log);

console.log(contentHandler);
