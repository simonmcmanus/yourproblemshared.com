exports.HOME       = '/';
exports.PUBLIC     = exports.HOME + 'assets/';
exports.ABOUT      = exports.HOME + 'about';
exports.CONTACT    = exports.HOME + 'contact';
exports.BROWSE     = exports.HOME + 'browse';
exports.EMAIL      = exports.HOME + ':company/mail/:id';
exports.RESOLVE    = exports.HOME + ':company/mail/:id/resolve/:hash';
exports.INBOUND    = exports.HOME + 'mail/sent';
exports.SEARCH     = exports.HOME + 'company/search';
exports.COMPANY    = exports.HOME + 'mail/company/:company';

  /**
  * does token replacement on a string.
  * @param  {string} str    string containing tokens eg: ":site"
  * @param  {object} tokens object containing the data eg: {site: 'harrybeagle'}
  * @return {string}       - url
  */
  exports.build = function(str, tokens) {
    for(var token in tokens) {
      if(!tokens.hasOwnProperty(token)) continue;
      str = str.replace(':'+token, tokens[token]);
    }
    return str;
  };

  /**
  * Get the full url, just passing in the key and tokens
  * @param  {string} key    from list above - eg LOGIN
  * @param  {object} tokens tokens to be replace in the url.
  * @return {string}        Returns the completed string.
  */
  exports.get = function(key, tokens) {
    return this.build(this[key], tokens);
  };