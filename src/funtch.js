import Builder from './Builder/index';

export * from './Utils/index';
export * from './Constants';

/**
 * funtch functional interface
 */
export class funtch {
  /**
   * Create builder with given URL.
   * @param  {String} url Requested URL
   * @return {Builder} Builder for configuring behavior
   */
  static url(url) {
    return new Builder().url(url);
  }

  /**
   * Perform a GET request with fetch for given URL
   * @param  {String} url Requested URL
   * @return {Promise} Fetch result
   */
  static get(url) {
    return new Builder().url(url).get();
  }

  /**
   * Perform a POST request with fetch for given URL and body.
   * Adding ContentType header if not defined according to body type (text or json)
   * @param  {String} url Requested URL
   * @param  {Object} body Body sent with request
   * @return {Promise} Fetch result
   */
  static post(url, body) {
    return new Builder().url(url).post(body);
  }

  /**
   * Perform a PUT request with fetch for given URL and body.
   * Adding ContentType header if not defined according to body type (text or json)
   * @param  {String} url Requested URL
   * @param  {Object} body Body sent with request
   * @return {Promise} Fetch result
   */
  static put(url, body) {
    return new Builder().url(url).put(body);
  }

  /**
   * Perform a PATCH request with fetch for given URL and body.
   * Adding ContentType header if not defined according to body type (text or json)
   * @param  {String} url Requested URL
   * @param  {Object} body Body sent with request
   * @return {Promise} Fetch result
   */
  static patch(url, body) {
    return new Builder().url(url).patch(body);
  }

  /**
   * Perform a DELETE request with fetch for given URL
   * @param  {String} url Requested URL
   * @return {Promise} Fetch result
   */
  static delete(url) {
    return new Builder().url(url).delete();
  }
}
