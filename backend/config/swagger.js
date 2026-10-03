import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import { config } from './constants.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load OpenAPI specification from YAML
const openApiPath = path.resolve(__dirname, '../docs/openapi.yaml')
const openApiContent = fs.readFileSync(openApiPath, 'utf8')
const swaggerSpec = YAML.parse(openApiContent)

// Dynamically configure servers based on active port
swaggerSpec.servers = [
  {
    url: `http://localhost:${config.port}`,
    description: 'Local Development Server',
  },
]

const swaggerUiOptions = {
  customSiteTitle: 'Journal App API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    withCredentials: true,
    docExpansion: 'list',
    filter: true,
  },
}

export {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions,
}
