import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import { config } from './config/constants.js'
import { swaggerSpec, swaggerUi, swaggerUiOptions } from './config/swagger.js'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './config/auth.js'
import noteRoutes from './routes/note.routes.js'
import reminderRoutes from './routes/reminder.routes.js'

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
app.use('/api/notes', noteRoutes)
app.use('/api/reminders', reminderRoutes)

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

export { app }
export default app
