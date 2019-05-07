module.exports = function CustomError(header_status, message) {
  this.message = message;
  this.header_status = header_status;
  return this;
};