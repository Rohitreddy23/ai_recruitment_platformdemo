// Security configuration
const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: '24h',
    issuer: 'ai-recruitment-platform',
    audience: 'recruitment-users'
  },

  // Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Rate Limiting
  rateLimits: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // login attempts per window
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10 // file uploads per window
    }
  },

  // File Upload Security
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    scanForMalware: process.env.NODE_ENV === 'production',
    quarantineDir: './quarantine'
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Session Security
  session: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  },

  // API Security
  api: {
    enableApiKeys: process.env.ENABLE_API_KEYS === 'true',
    requireHttps: process.env.NODE_ENV === 'production',
    enableRequestSigning: false
  },

  // Audit Configuration
  audit: {
    enabled: true,
    logLevel: 'info',
    retentionDays: 90,
    sensitiveFields: ['password', 'token', 'apiKey', 'secret', 'ssn', 'creditCard']
  }
};

module.exports = securityConfig;