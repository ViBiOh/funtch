module.exports = funtch => {
  /**
   * Simple GET
   */
  funtch
    .get('https://api.vibioh.fr/hello/funtch')
    .then(data => console.log('Simple GET', data, '\n'));

  /**
   * GET with custom content reader (e.g. prefixing, wrapping, deserialization)
   */
  funtch
    .url('https://api.vibioh.fr/hello/funtch')
    .content(response => {
      const wrap = (resolve, data) =>
        resolve({
          status: response.status,
          payload: data,
        });

      return new Promise(resolve => funtch.readContent(response).then(data => wrap(resolve, data)));
    })
    .get()
    .then(data => console.log('GET with custom content reader', data, '\n'));

  /**
   * GET with custom content reader (e.g. prefixing, wrapping, deserialization)
   */
  const contentTypeJsonRegex = new RegExp(funtch.MEDIA_TYPE_JSON, 'i');
  const contentTypeXmlRegex = /application\/xml/i;

  funtch
    .url('https://vibioh.fr/sitemap.xml')
    .content(response => {
      if (contentTypeJsonRegex.test(response.headers.get(funtch.CONTENT_TYPE_HEADER))) {
        return response.json();
      }

      return new Promise(resolve => {
        response.text().then(data => {
          if (contentTypeXmlRegex.test(response.headers.get(funtch.CONTENT_TYPE_HEADER))) {
            resolve(new DOMParser().parseFromString(data, 'text/xml'));
          }
          resolve(data);
        });
      });
    })
    .get()
    .then(data => console.log('GET with XML content reader', data, '\n'));

  /**
   * GET with error
   */
  funtch.get('https://api.vibioh.fr/').catch(err => console.error('GET with error', err, '\n'));

  /**
   * GET with custom error handler (e.g. perform a redirect)
   */
  funtch
    .url('https://api.vibioh.fr/auth/')
    .error(response => {
      if (response.status === 401) {
        console.log('Login required, redirection to /login');
      }

      return funtch.errorHandler(response); // using default behavior for continuing process
    })
    .get()
    .catch(err => console.error('GET with custom error handler', err, '\n'));
};
