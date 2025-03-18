/**
 * AWS Infrastructure Configuration
 * Manages all AWS service configurations for the banking system
 */

export const awsConfig = {
  // Cognito Authentication
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID || 'us-east-1_g5urRrRvg',
    clientId: process.env.COGNITO_CLIENT_ID || '2qg67m083md62on495ptt3okqs',
    domain: process.env.COGNITO_DOMAIN || 'sistema-bancario-dev.auth.us-east-1.amazoncognito.com',
    region: process.env.AWS_REGION || 'us-east-1',
    callbackUrls: [
      process.env.COGNITO_CALLBACK_URL || 'http://localhost:3000/auth/callback'
    ],
    logoutUrls: [
      process.env.COGNITO_LOGOUT_URL || 'http://localhost:3000'
    ]
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'sistema-bancario-db.c6daoieako9t.us-east-1.rds.amazonaws.com',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'dbmaster',
    database: process.env.DB_NAME || 'sistema_bancario',
    type: 'postgres'
  },

  // Event Bridge Configuration
  eventBridge: {
    eventBusArn: process.env.EVENT_BUS_ARN || 'arn:aws:events:us-east-1:054037132491:event-bus/sistema-bancario-events',
    eventBusName: 'sistema-bancario-events',
    region: process.env.AWS_REGION || 'us-east-1'
  },

  // DynamoDB Audit Configuration
  dynamodb: {
    tableName: process.env.DYNAMODB_TABLE || 'sistema-bancario-auditoria',
    region: process.env.AWS_REGION || 'us-east-1'
  },

  // S3 Storage Configuration
  s3: {
    bucketName: process.env.S3_BUCKET || 'sistema-bancario-archivos-dev',
    region: process.env.AWS_REGION || 'us-east-1'
  }
};
