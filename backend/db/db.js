import dns from 'dns'
import mongoose from 'mongoose'

// Ensure Node.js resolves MongoDB Atlas SRV records reliably across all network environments
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
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
