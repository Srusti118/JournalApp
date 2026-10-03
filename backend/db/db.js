import mongoose from 'mongoose'

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Force IPv4
    })
    
    console.log('✅ MongoDB connected successfully!')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export { connectDB }
export default connectDB
