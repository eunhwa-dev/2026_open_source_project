class HttpError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = options.code;
  }
}

module.exports = { HttpError };
