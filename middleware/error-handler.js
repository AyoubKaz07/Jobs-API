const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // default error
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  }

  // Validation error
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    // Get the error messages from errors object's properties
    // please provide a name, please provide an email, please provide a password
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ')
  }

  // Duplicate field error
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
  }

  // Invalid :id syntax error
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `No item found with id : ${err.value}`
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
