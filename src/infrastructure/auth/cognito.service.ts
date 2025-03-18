import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { awsConfig } from '../config/aws.config';

/**
 * Authentication service using Amazon Cognito
 * Handles user authentication and management
 */
@Injectable()
export class CognitoService {
  private readonly cognito: CognitoIdentityServiceProvider;

  constructor() {
    this.cognito = new CognitoIdentityServiceProvider({
      region: awsConfig.cognito.region,
    });
  }

  /**
   * Validates a JWT token from Cognito
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const params = {
        AccessToken: token,
      };
      await this.cognito.getUser(params).promise();
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Gets user information from Cognito
   */
  async getUserInfo(username: string): Promise<any> {
    const params = {
      UserPoolId: awsConfig.cognito.userPoolId,
      Username: username,
    };

    try {
      const userData = await this.cognito.adminGetUser(params).promise();
      return userData;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  /**
   * Updates user attributes in Cognito
   */
  async updateUserAttributes(username: string, attributes: Record<string, string>): Promise<void> {
    const userAttributes = Object.entries(attributes).map(([Name, Value]) => ({ Name, Value }));

    const params = {
      UserPoolId: awsConfig.cognito.userPoolId,
      Username: username,
      UserAttributes: userAttributes,
    };

    try {
      await this.cognito.adminUpdateUserAttributes(params).promise();
    } catch (error) {
      console.error('Error updating user attributes:', error);
      throw error;
    }
  }
}
