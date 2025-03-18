# Banking System Infrastructure

## Overview
This repository contains the infrastructure as code (IaC) for the banking system, implemented using Terraform and AWS free tier services.

## Architecture Components

### 1. Authentication (Amazon Cognito)
- **User Pool**: `sistema-bancario-users`
  - Email verification
  - Secure password policies
  - Account recovery via email
  - Custom attributes for company roles
- **Client Configuration**:
  - OAuth2 enabled
  - Callback URLs configured
  - Token validity:
    - Refresh Token: 30 days
    - Access Token: 1 hour
    - ID Token: 1 hour

### 2. Domain Events (EventBridge)
- **Event Bus**: `sistema-bancario-events`
- **Event Patterns**:
  - EnterpriseCreated
  - EnterpriseUpdated
- **Lambda Integration**:
  - Event processing
  - Audit logging
  - Async operations

### 3. Database Layer
- **PostgreSQL (RDS)**:
  - Instance: db.t3.micro (Free Tier)
  - Storage: 20GB gp2
  - Automated backups
- **DynamoDB**:
  - Audit logging
  - Pay-per-request pricing
  - Free tier eligible

### 4. Network Configuration
- **VPC**: `10.0.0.0/16`
- **Public Subnet**: `10.0.1.0/24`
- **Security Groups**:
  - RDS access
  - Lambda permissions
  - Event bus rules

## Cost Estimation (Free Tier)

### First Year (Free Tier Benefits)
1. **Cognito**:
   - 50,000 MAU (Monthly Active Users)
   - Free authentication features
   - Free MFA

2. **RDS PostgreSQL**:
   - 750 hours/month
   - 20GB storage
   - Free automated backups

3. **EventBridge**:
   - First million events/month
   - Custom event bus included

4. **Lambda**:
   - 1M free requests/month
   - 400,000 GB-seconds/month

### After Free Tier
- Estimated monthly cost: $15-25
- Main costs:
  - RDS: ~$13-15/month
  - DynamoDB: $0-5/month
  - Other services: Minimal cost

## Security Features
- Email verification enabled
- Secure password policies
- IAM roles with minimal permissions
- VPC security groups
- Encrypted database storage

## Deployment Instructions

1. **Prerequisites**:
   ```bash
   # Install required tools
   brew install terraform awscli
   ```

2. **AWS Configuration**:
   ```bash
   # Configure AWS credentials
   aws configure
   ```

3. **Infrastructure Deployment**:
   ```bash
   # Initialize Terraform
   terraform init

   # Review changes
   terraform plan

   # Apply changes
   terraform apply
   ```

## Integration with Clean Architecture
This infrastructure supports the project's:
- Domain-Driven Design (DDD)
- CQRS pattern
- Clean Architecture principles
- Event-driven architecture

## Environment Variables
Required environment variables:
```bash
export TF_VAR_db_password="your_secure_password"
export TF_VAR_ambiente="dev"
```

## Best Practices
1. Keep credentials in `~/.aws/credentials`
2. Never commit sensitive data
3. Use environment variables for secrets
4. Monitor AWS Cost Explorer
5. Regular security audits

## Support
For questions or issues:
1. Review AWS documentation
2. Check Terraform registry
3. Contact the development team
