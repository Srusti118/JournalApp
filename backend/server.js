import 'dotenv/config'
import connectDB from './db/db.js'
import { validateEnv, config } from './config/constants.js'

// Validate environment
validateEnv()

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB()

    // Dynamically import app after database connection is established
    const { default: app } = await import('./app.js')

    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`)
      if (config.enableSwagger) {
        console.log(`Swagger documentation available at http://localhost:${config.port}/api-docs`)
      }
    })

    // Start background cron job for scheduled reminders
    const { initCron } = await import('./services/cron.service.js')
    initCron()
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()