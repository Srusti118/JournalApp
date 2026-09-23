const User = require('../models/user.model')
const { AppError } = require('../middleware/errorHandler')

const registerUser = async (username, email, password) => {
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    })

    if (existingUser) {
        throw new AppError('User already exists', 400, 'USER_EXISTS')
    }

    const user = await User.create({ username, email, password })
    return user
}

const loginUser = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    return user
}

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password')
    return user
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
}
