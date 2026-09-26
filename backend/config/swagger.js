const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const swaggerUi = require('swagger-ui-express')
const { config } = require('./constants')

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

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions,
}
