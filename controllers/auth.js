const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.CreateJWT()
    res.status(StatusCodes.CREATED).json({ token })
}

const login = async (req, res) => {
    // Validate Input
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    // Verify user existance
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    // Verify password
    const isPasswordCorrect = await user.comparePasswords(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    // Create token
    const token = user.CreateJWT()
    res.status(StatusCodes.OK).json({ token })
}

module.exports = {
    register,
    login
}