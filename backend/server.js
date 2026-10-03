import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './db/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import { validateEnv, config } from './config/constants.js'
import { swaggerSpec, swaggerUi, swaggerUiOptions } from './config/swagger.js'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './config/auth.js'
import authRoutes from './routes/auth.routes.js'
import noteRoutes from './routes/note.routes.js'

// Validate environment
validateEnv()

const app = express()

// Trust proxy (for production behind reverse proxy)
app.set('trust proxy', 1)

// Middleware
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
)

// Better Auth handler - mounted BEFORE express.json() to avoid consuming stream
app.all('/api/auth/*', toNodeHandler(auth))

app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Swagger API Documentation
if (config.enableSwagger) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  })
})

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`)
      if (config.enableSwagger) {
        console.log(`Swagger documentation available at http://localhost:${config.port}/api-docs`)
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()