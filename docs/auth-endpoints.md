# Authentication Endpoints

## Configuration
```
COGNITO_ENDPOINT=https://cognito-idp.us-east-1.amazonaws.com
CLIENT_ID=39pjpubg77t6q5ng74sgv29snt
USER_POOL_ID=us-east-1_WspJ9LTEv
```

## Sign Up
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.SignUp' \
--data-raw '{
    "ClientId": "$CLIENT_ID",
    "Username": "nstorspeed70@gmail.com",
    "Password": "Nestor1020*",
    "UserAttributes": [
        {
            "Name": "email",
            "Value": "nstorspeed70@gmail.com"
        }
    ]
}'
```

## Confirm Sign Up
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.ConfirmSignUp' \
--data-raw '{
    "ClientId": "$CLIENT_ID",
    "Username": "nstorspeed70@gmail.com",
    "ConfirmationCode": "123456"
}'
```

## Sign In
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth' \
--data-raw '{
    "AuthFlow": "USER_PASSWORD_AUTH",
    "ClientId": "$CLIENT_ID",
    "AuthParameters": {
        "USERNAME": "nstorspeed70@gmail.com",
        "PASSWORD": "Nestor1020*"
    }
}'
```

## Resend Confirmation Code
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.ResendConfirmationCode' \
--data-raw '{
    "ClientId": "$CLIENT_ID",
    "Username": "nstorspeed70@gmail.com"
}'
```

## Forgot Password
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.ForgotPassword' \
--data-raw '{
    "ClientId": "$CLIENT_ID",
    "Username": "nstorspeed70@gmail.com"
}'
```

## Confirm Forgot Password
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.ConfirmForgotPassword' \
--data-raw '{
    "ClientId": "$CLIENT_ID",
    "Username": "nstorspeed70@gmail.com",
    "Password": "NewPassword123!",
    "ConfirmationCode": "123456"
}'
```

## Change Password
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.ChangePassword' \
--header 'Authorization: Bearer $ACCESS_TOKEN' \
--data-raw '{
    "PreviousPassword": "OldPassword123!",
    "ProposedPassword": "NewPassword123!"
}'
```

## Sign Out
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.GlobalSignOut' \
--header 'Authorization: Bearer $ACCESS_TOKEN'
```

## Get User
```bash
curl --location '$COGNITO_ENDPOINT' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.GetUser' \
--header 'Authorization: Bearer $ACCESS_TOKEN'
```
