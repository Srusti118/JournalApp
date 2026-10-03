import { User } from '../models/user.model.js'
import { AppError } from '../middleware/errorHandler.js'

export const registerUser = async (username, email, password) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new AppError('User already exists', 400, 'USER_EXISTS')
  }

  const user = await User.create({ username, email, password })
  return user
}

export const loginUser = async (email, password) => {
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

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password')
  return user
}

export default {
  registerUser,
  loginUser,
  getUserById,
}
