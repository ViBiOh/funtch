module.exports = funtch => {
  /**
   * Simple GET on GitHub API
   */
  funtch.get('https://api.vibioh.fr/hello/funtch').then(console.log);

  /**
   * Simple GET with error
   */
  funtch.post('https://api.vibioh.fr/').catch(console.error);
};
