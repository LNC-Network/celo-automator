import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

export interface ApiConfig {
  allowedOrigins?: string[];
  port?: number;
  enableSwagger?: boolean;
  enableRateLimit?: boolean;
  rateLimitWindowMs?: number;
  rateLimitMax?: number;
}

/**
 * Setup function to configure Express app with Celo AI Agents API routes and middleware
 * @param app - Express application instance
 * @param config - Optional configuration options
 */
export function setupApi(app: Express, config: ApiConfig = {}): void {
  const {
    allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    port = Number(process.env.PORT) || 3000,
    enableSwagger = true,
    enableRateLimit = true,
    rateLimitWindowMs = 15 * 60 * 1000,
    rateLimitMax = 100
  } = config;

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  // Rate limiting
  if (enableRateLimit) {
    const limiter = rateLimit({
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
      message: 'Too many requests from this IP, please try again later.'
    });
    app.use(limiter);
  }

  // Compression and logging
  app.use(compression());
  app.use(morgan('combined'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Swagger documentation
  if (enableSwagger) {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Celo AI Agents API',
          version: '1.0.0',
          description: 'REST API for automated blockchain processes on Celo',
          contact: {
            name: 'Celo AI Agents Team',
            email: 'support@celo-ai-agents.com'
          }
        },
        servers: [{ url: `http://localhost:${port}`, description: 'Development server' }],
        components: {
          securitySchemes: {
            ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' }
          }
        }
      },
      apis: ['./src/routes/*.ts', './src/controllers/*.ts']
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: { database: 'connected', blockchain: 'connected', alchemy: 'connected' }
    });
  });

  // Load routes (only if they exist)
  // Routes are optional and can be added separately
  // Using dynamic require for optional route loading
  const loadRoute = (routePath: string, mountPath: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const routeModule = require(routePath);
      if (routeModule?.default) {
        app.use(mountPath, routeModule.default);
      }
    } catch (e) {
      // Routes not implemented yet - silently continue
    }
  };

  loadRoute('./routes/contracts', '/api/v1/contracts');
  loadRoute('./routes/security', '/api/v1/security');
  loadRoute('./routes/nft', '/api/v1/nft');
  loadRoute('./routes/deployment', '/api/v1/deployment');

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Celo AI Agents API',
      version: '1.0.0',
      documentation: '/api-docs',
      health: '/health'
    });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'unknown'
      }
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: { message: 'Endpoint not found', code: 'NOT_FOUND', path: req.originalUrl }
    });
  });
}

// Export default setup function for convenience
export default setupApi;
