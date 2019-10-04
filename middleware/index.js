function errorHandler(error, req, res, next) {
  res.status(error.code).json({ message: error.message })
}

module.exports = { errorHandler }
