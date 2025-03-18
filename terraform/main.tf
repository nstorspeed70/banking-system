# Variables
variable "proyecto" {
  default = "sistema-bancario"
}

variable "ambiente" {
  default = "dev"
}

variable "db_password" {
  type = string
}

variable "event_bus_name" {
  default = "sistema-bancario-events"
}

# Provider
provider "aws" {
  region = "us-east-1"
}

# Data Sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# VPC y configuración de red
resource "aws_vpc" "principal" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.proyecto}-vpc"
    Environment = var.ambiente
  }
}

# Subnet pública en zona a
resource "aws_subnet" "publica_a" {
  vpc_id                  = aws_vpc.principal.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.proyecto}-subnet-publica-1a"
    Environment = var.ambiente
  }
}

# Subnet pública en zona b
resource "aws_subnet" "publica_b" {
  vpc_id                  = aws_vpc.principal.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.proyecto}-subnet-publica-1b"
    Environment = var.ambiente
  }
}

# Subnet privada en zona a
resource "aws_subnet" "privada_a" {
  vpc_id                  = aws_vpc.principal.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.proyecto}-subnet-privada-1a"
    Environment = var.ambiente
  }
}

# Subnet privada en zona b
resource "aws_subnet" "privada_b" {
  vpc_id                  = aws_vpc.principal.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.proyecto}-subnet-privada-1b"
    Environment = var.ambiente
  }
}

# Internet Gateway
resource "aws_internet_gateway" "principal" {
  vpc_id = aws_vpc.principal.id

  tags = {
    Name        = "${var.proyecto}-igw"
    Environment = var.ambiente
  }
}

# Route Table
resource "aws_route_table" "principal" {
  vpc_id = aws_vpc.principal.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.principal.id
  }

  tags = {
    Name        = "${var.proyecto}-rt"
    Environment = var.ambiente
  }
}

# Route Table Associations
resource "aws_route_table_association" "publica_a" {
  subnet_id      = aws_subnet.publica_a.id
  route_table_id = aws_route_table.principal.id
}

resource "aws_route_table_association" "publica_b" {
  subnet_id      = aws_subnet.publica_b.id
  route_table_id = aws_route_table.principal.id
}

# EIP para NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"

  depends_on = [aws_internet_gateway.principal]

  tags = {
    Name        = "${var.proyecto}-nat-eip"
    Environment = var.ambiente
  }
}

# NAT Gateway
resource "aws_nat_gateway" "principal" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.publica_a.id

  depends_on = [aws_internet_gateway.principal]

  tags = {
    Name        = "${var.proyecto}-nat"
    Environment = var.ambiente
  }
}

# Route Table privada
resource "aws_route_table" "privada" {
  vpc_id = aws_vpc.principal.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.principal.id
  }

  tags = {
    Name        = "${var.proyecto}-rt-privada"
    Environment = var.ambiente
  }
}

# Route Table Associations para subnets privadas
resource "aws_route_table_association" "privada_a" {
  subnet_id      = aws_subnet.privada_a.id
  route_table_id = aws_route_table.privada.id
}

resource "aws_route_table_association" "privada_b" {
  subnet_id      = aws_subnet.privada_b.id
  route_table_id = aws_route_table.privada.id
}

# RDS Security Group
resource "aws_security_group" "db" {
  name_prefix = "${var.proyecto}-db-"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.principal.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [module.lambda.security_group_id]
    description     = "Allow Lambda access to PostgreSQL"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "${var.proyecto}-db-sg"
    Environment = var.ambiente
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "principal" {
  name       = "${var.proyecto}-subnet-group"
  subnet_ids = concat(
    [aws_subnet.publica_a.id, aws_subnet.publica_b.id],
    [aws_subnet.privada_a.id, aws_subnet.privada_b.id]
  )

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.proyecto}-db-subnet-group"
    Environment = var.ambiente
  }
}

# RDS Instance
resource "aws_db_instance" "principal" {
  identifier           = "${var.proyecto}-db"
  engine              = "postgres"
  engine_version      = "12.19"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  
  username            = "dbmaster"
  password            = var.db_password
  db_name            = "sistema_bancario"

  skip_final_snapshot = true
  publicly_accessible = false
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.principal.name

  tags = {
    Name        = "${var.proyecto}-db"
    Environment = var.ambiente
  }
}

# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.proyecto}-users-v2"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]
  
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  tags = {
    Name        = "${var.proyecto}-user-pool"
    Environment = var.ambiente
  }
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.proyecto}-${var.ambiente}-v2"
  user_pool_id = aws_cognito_user_pool.main.id
}

resource "aws_cognito_user_pool_client" "client" {
  name                = "${var.proyecto}-client"
  user_pool_id        = aws_cognito_user_pool.main.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  
  prevent_user_existence_errors = "ENABLED"
  
  access_token_validity  = 60
  id_token_validity     = 60
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "minutes"
    id_token     = "minutes"
    refresh_token = "days"
  }
}

# Lambda Code
resource "local_file" "enterprises_lambda_code" {
  filename = "${path.module}/lambda/enterprises.js"
  content  = file("${path.module}/lambda/enterprises.js")
}

data "archive_file" "enterprises_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/enterprises_lambda.zip"
}

# Lambda Module
module "lambda" {
  source = "./modules/lambda"

  project_name    = var.proyecto
  environment     = var.ambiente
  lambda_zip_path = data.archive_file.enterprises_lambda_zip.output_path
  vpc_id         = aws_vpc.principal.id
  
  db_host     = aws_db_instance.principal.address
  db_port     = tostring(aws_db_instance.principal.port)
  db_user     = aws_db_instance.principal.username
  db_password = var.db_password
  db_name     = aws_db_instance.principal.db_name
  
  subnet_ids  = [aws_subnet.privada_a.id, aws_subnet.privada_b.id]
  api_execution_arn = module.api.execution_arn
}

# API Gateway Module
module "api" {
  source = "./modules/api"

  api_name          = "${var.proyecto}-api"
  environment       = var.ambiente
  cognito_arn      = aws_cognito_user_pool.main.arn
  lambda_invoke_arn = module.lambda.invoke_arn
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api.execution_arn}/*/*"
}

# EventBridge Event Bus
resource "aws_cloudwatch_event_bus" "domain_events" {
  name = var.event_bus_name

  tags = {
    Name        = "${var.proyecto}-events"
    Environment = var.ambiente
  }
}

# IAM User Policy para desarrollo
resource "aws_iam_user_policy" "dev_policy" {
  name = "${var.proyecto}-dev-policy"
  user = "nstorspeed70"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:*",
          "dynamodb:*",
          "events:*",
          "cognito-idp:*",
          "s3:*",
          "rds:*",
          "apigateway:*",
          "ec2:*",
          "ec2:DescribeAddresses",
          "ec2:DescribeAddressesAttribute",
          "cognito-idp:AdminConfirmSignUp",
          "cognito-idp:AdminInitiateAuth",
          "cognito-idp:SignUp",
          "cognito-idp:InitiateAuth",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserPassword"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:GetLogEvents",
          "logs:FilterLogEvents",
          "logs:DeleteLogGroup",
          "logs:DeleteLogStream",
          "logs:PutRetentionPolicy",
          "logs:DeleteRetentionPolicy",
          "logs:ListTagsLogGroup",
          "logs:TagLogGroup",
          "logs:UntagLogGroup"
        ]
        Resource = [
          "arn:aws:logs:us-east-1:${data.aws_caller_identity.current.account_id}:log-group:*",
          "arn:aws:logs:us-east-1:${data.aws_caller_identity.current.account_id}:log-group:*:*"
        ]
      }
    ]
  })
}

# Outputs
output "api_url" {
  value = module.api.api_url
}

output "cognito_endpoint" {
  value = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

output "cognito_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "db_endpoint" {
  value = "${aws_db_instance.principal.endpoint}"
}
