import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId
      },
      minLength: [6, 'Password must be at least 6 characters'],
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema, 'user')

export { User }
export default User

