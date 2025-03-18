# API Gateway
resource "aws_api_gateway_rest_api" "principal" {
  name = var.api_name
  description = "API for enterprise management"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name     = var.api_name
    Environment = var.environment
  }
}

# Cognito Authorizer
resource "aws_api_gateway_authorizer" "cognito" {
  name                   = "sistema-bancario-cognito-authorizer"
  rest_api_id            = aws_api_gateway_rest_api.principal.id
  type                   = "COGNITO_USER_POOLS"
  provider_arns          = [var.cognito_arn]
  identity_source        = "method.request.header.Authorization"
  authorizer_result_ttl_in_seconds = 0
}

# Enterprises Resource
resource "aws_api_gateway_resource" "enterprises" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_rest_api.principal.root_resource_id
  path_part   = "enterprises"
}

# POST /enterprises
resource "aws_api_gateway_method" "create_enterprise" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.enterprises.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "create_enterprise" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.enterprises.id
  http_method             = aws_api_gateway_method.create_enterprise.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"
}

# GET /enterprises
resource "aws_api_gateway_method" "list_enterprises" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.enterprises.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "list_enterprises" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.enterprises.id
  http_method             = aws_api_gateway_method.list_enterprises.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"
}

# GET /enterprises/{id}
resource "aws_api_gateway_resource" "enterprise" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_resource.enterprises.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "get_enterprise" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.enterprise.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "get_enterprise" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.enterprise.id
  http_method             = aws_api_gateway_method.get_enterprise.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }
}

# PUT /enterprises/{id}
resource "aws_api_gateway_method" "update_enterprise" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.enterprise.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "update_enterprise" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.enterprise.id
  http_method             = aws_api_gateway_method.update_enterprise.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }
}

# DELETE /enterprises/{id}
resource "aws_api_gateway_method" "delete_enterprise" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.enterprise.id
  http_method   = "DELETE"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "delete_enterprise" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.enterprise.id
  http_method             = aws_api_gateway_method.delete_enterprise.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }
}

# /enterprises/{id}/parties
resource "aws_api_gateway_resource" "parties" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_resource.enterprise.id
  path_part   = "parties"
}

# POST /enterprises/{id}/parties
resource "aws_api_gateway_method" "create_party" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.parties.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_integration" "create_party" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.parties.id
  http_method             = aws_api_gateway_method.create_party.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }
}

# GET /enterprises/{id}/parties
resource "aws_api_gateway_method" "list_parties" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.parties.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id"            = true
    "method.request.querystring.page"   = false
    "method.request.querystring.limit"  = false
    "method.request.querystring.role"   = false
  }
}

resource "aws_api_gateway_integration" "list_parties" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.parties.id
  http_method             = aws_api_gateway_method.list_parties.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }
}

# /parties resource
resource "aws_api_gateway_resource" "parties_root" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_rest_api.principal.root_resource_id
  path_part   = "parties"
}

# /parties/{id}
resource "aws_api_gateway_resource" "party" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_resource.parties_root.id
  path_part   = "{id}"
}

# /parties/{id}/enterprises
resource "aws_api_gateway_resource" "party_enterprises" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_resource.party.id
  path_part   = "enterprises"
}

# GET /parties/{id}/enterprises
resource "aws_api_gateway_method" "list_party_enterprises" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.party_enterprises.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id"            = true
    "method.request.querystring.page"   = false
    "method.request.querystring.limit"  = false
  }
}

resource "aws_api_gateway_integration" "list_party_enterprises" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.party_enterprises.id
  http_method             = aws_api_gateway_method.list_party_enterprises.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id" = "method.request.path.id"
  }
}

# /enterprises/{id}/parties/{partyId}
resource "aws_api_gateway_resource" "party_id" {
  rest_api_id = aws_api_gateway_rest_api.principal.id
  parent_id   = aws_api_gateway_resource.parties.id
  path_part   = "{partyId}"
}

# PUT /enterprises/{id}/parties/{partyId}
resource "aws_api_gateway_method" "update_party" {
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  resource_id   = aws_api_gateway_resource.party_id.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  request_parameters = {
    "method.request.path.id"      = true
    "method.request.path.partyId" = true
  }
}

resource "aws_api_gateway_integration" "update_party" {
  rest_api_id             = aws_api_gateway_rest_api.principal.id
  resource_id             = aws_api_gateway_resource.party_id.id
  http_method             = aws_api_gateway_method.update_party.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = "WHEN_NO_MATCH"

  request_parameters = {
    "integration.request.path.id"      = "method.request.path.id"
    "integration.request.path.partyId" = "method.request.path.partyId"
  }
}

# Deployment
resource "aws_api_gateway_deployment" "principal" {
  rest_api_id = aws_api_gateway_rest_api.principal.id

  depends_on = [
    aws_api_gateway_integration.create_enterprise,
    aws_api_gateway_integration.list_enterprises,
    aws_api_gateway_integration.get_enterprise,
    aws_api_gateway_integration.update_enterprise,
    aws_api_gateway_integration.delete_enterprise,
    aws_api_gateway_integration.create_party,
    aws_api_gateway_integration.list_parties,
    aws_api_gateway_integration.list_party_enterprises,
    aws_api_gateway_integration.update_party
  ]

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.enterprises,
      aws_api_gateway_resource.enterprise,
      aws_api_gateway_resource.parties,
      aws_api_gateway_resource.parties_root,
      aws_api_gateway_resource.party,
      aws_api_gateway_resource.party_enterprises,
      aws_api_gateway_resource.party_id,
      aws_api_gateway_method.create_enterprise,
      aws_api_gateway_method.list_enterprises,
      aws_api_gateway_method.get_enterprise,
      aws_api_gateway_method.update_enterprise,
      aws_api_gateway_method.delete_enterprise,
      aws_api_gateway_method.create_party,
      aws_api_gateway_method.list_parties,
      aws_api_gateway_method.list_party_enterprises,
      aws_api_gateway_method.update_party,
      aws_api_gateway_integration.create_enterprise,
      aws_api_gateway_integration.list_enterprises,
      aws_api_gateway_integration.get_enterprise,
      aws_api_gateway_integration.update_enterprise,
      aws_api_gateway_integration.delete_enterprise,
      aws_api_gateway_integration.create_party,
      aws_api_gateway_integration.list_parties,
      aws_api_gateway_integration.list_party_enterprises,
      aws_api_gateway_integration.update_party
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Stage
resource "aws_api_gateway_stage" "dev" {
  deployment_id = aws_api_gateway_deployment.principal.id
  rest_api_id   = aws_api_gateway_rest_api.principal.id
  stage_name    = var.environment

  tags = {
    Name        = "${var.api_name}-${var.environment}"
    Environment = var.environment
  }
}

# Variables
variable "api_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "cognito_arn" {
  type = string
}

variable "lambda_invoke_arn" {
  type = string
}

# Outputs
output "api_url" {
  value = aws_api_gateway_stage.dev.invoke_url
}

output "rest_api_id" {
  value = aws_api_gateway_rest_api.principal.id
}

output "root_resource_id" {
  value = aws_api_gateway_rest_api.principal.root_resource_id
}

output "execution_arn" {
  value = aws_api_gateway_rest_api.principal.execution_arn
}
