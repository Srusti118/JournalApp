require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/db')
const { errorHandler } = require('./middleware/errorHandler')
const { validateEnv, config } = require('./config/constants')
const { swaggerSpec, swaggerUi, swaggerUiOptions } = require('./config/swagger')

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
app.use(express.json())
app.use(cookieParser())

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Server health check
 *     description: Returns server operational status and ISO timestamp.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is online and functioning
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-09-26T08:15:00.000Z
 */
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
const authRoutes = require('./routes/auth.routes')
const noteRoutes = require('./routes/note.routes')

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