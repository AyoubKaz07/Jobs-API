const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // basically we're preparing the next middleware to have access to the user (attaching)
        // using the user info for the jobs logic
        req.user = { userId: decoded.userId, name: decoded.name }
        next()
    }
    catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth