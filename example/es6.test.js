import funtch, { errorHandler } from '../index';

async function example() {
  let output;
  /**
   * Simple GET
   */
  output = await funtch.get('https://api.vibioh.fr/hello/funtch');
  global.console.log('GET', output, '\n');

  /**
   * GET with query params
   */
  output = await funtch
    .url('https://api.vibioh.fr/dump/')
    .query({ v: '2.4.0', q: 'funtch' })
    .get();
  global.console.log('GET w/ query params', output, '\n');

  /**
   * GET with full content reader
   */
  output = await funtch
    .url('https://api.vibioh.fr/hello/funtch')
    .fullResponse()
    .get();
  global.console.log('Get w/ fullResponse', output, '\n');

  /**
   * GET with error
   */
  try {
    await funtch.get('https://api.vibioh.fr/not_found');
  } catch (err) {
    global.console.error('GET with error', err, '\n');
  }

  /**
   * Aborted request
   */
  const fetchRequest = funtch
    .url('https://api.vibioh.fr/delay/1')
    .abortHandler(() => global.console.warn('Aborted')); // 10 second delay

  fetchRequest.get().catch((e) => global.console.error(e));
  fetchRequest.abort(); // Request is canceled and will throw an error unless you have setted `onAbort(callback)`

  /**
   * GET with custom error handler (e.g. perform a redirect)
   */
  try {
    output = await funtch
      .url('https://api.github.com/repositories/ViBiOh/infra')
      .errorHandler((response) => {
        if (response.status === 401) {
          global.console.log('Login required, redirection to /login');
        }

        return errorHandler(response); // using default behavior for continuing process
      })
      .get();
  } catch (err) {
    global.console.error('GET with custom error handler', err, '\n');
  }
}

example();
