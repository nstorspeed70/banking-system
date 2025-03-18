import { Injectable, Logger } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';

@Injectable()
export class DynamoDBEnterpriseRepository implements IEnterpriseRepository {
  private readonly logger = new Logger(DynamoDBEnterpriseRepository.name);
  private readonly tableName = process.env.ENTERPRISES_TABLE_NAME || 'enterprises';
  private readonly dynamoDB: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDB = new DynamoDB.DocumentClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    this.logger.log(`🏢 DynamoDB Enterprise Repository inicializado. Tabla: ${this.tableName}`);
  }

  async save(enterprise: EnterpriseAggregate): Promise<EnterpriseAggregate> {
    const item = {
      id: enterprise.id || uuidv4(),
      taxId: enterprise.taxId.toString(),
      legalBusinessName: enterprise.legalBusinessName,
      enterpriseType: enterprise.enterpriseType,
      contactEmail: enterprise.contactEmail.toString(),
      contactPhone: enterprise.contactPhone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      this.logger.log(`📝 Guardando empresa: ${JSON.stringify(item)}`);
      
      await this.dynamoDB.put({
        TableName: this.tableName,
        Item: item
      }).promise();
      
      this.logger.log(`✅ Empresa guardada: ${item.id}`);
      return enterprise;
    } catch (error) {
      this.logger.error(`❌ Error al guardar empresa: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<EnterpriseAggregate | null> {
    try {
      const result = await this.dynamoDB.get({
        TableName: this.tableName,
        Key: { id }
      }).promise();

      if (!result.Item) {
        return null;
      }

      return this.toAggregate(result.Item);
    } catch (error) {
      this.logger.error(`❌ Error al buscar empresa por ID: ${error.message}`);
      throw error;
    }
  }

  async findByTaxId(taxId: string): Promise<EnterpriseAggregate | null> {
    try {
      const result = await this.dynamoDB.query({
        TableName: this.tableName,
        IndexName: 'TaxIdIndex',
        KeyConditionExpression: 'taxId = :taxId',
        ExpressionAttributeValues: {
          ':taxId': taxId
        }
      }).promise();

      if (!result.Items || result.Items.length === 0) {
        return null;
      }

      return this.toAggregate(result.Items[0]);
    } catch (error) {
      this.logger.error(`❌ Error al buscar empresa por Tax ID: ${error.message}`);
      throw error;
    }
  }

  async findAll(filter?: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: EnterpriseAggregate[]; total: number }> {
    try {
      const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: this.tableName
      };

      if (filter?.enterpriseType) {
        params.FilterExpression = 'enterpriseType = :type';
        params.ExpressionAttributeValues = {
          ':type': filter.enterpriseType
        };
      }

      const result = await this.dynamoDB.scan(params).promise();
      const items = result.Items?.map(item => this.toAggregate(item)) || [];

      // Aplicar paginación en memoria
      const page = filter?.page || 1;
      const limit = filter?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      return {
        items: items.slice(startIndex, endIndex),
        total: items.length
      };
    } catch (error) {
      this.logger.error(`❌ Error al listar empresas: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<EnterpriseAggregate>): Promise<EnterpriseAggregate> {
    try {
      const updateExpressions: string[] = [];
      const expressionAttributeNames: { [key: string]: string } = {};
      const expressionAttributeValues: { [key: string]: any } = {};

      if (data.taxId) {
        updateExpressions.push('#taxId = :taxId');
        expressionAttributeNames['#taxId'] = 'taxId';
        expressionAttributeValues[':taxId'] = data.taxId.toString();
      }

      if (data.legalBusinessName) {
        updateExpressions.push('#lbn = :lbn');
        expressionAttributeNames['#lbn'] = 'legalBusinessName';
        expressionAttributeValues[':lbn'] = data.legalBusinessName;
      }

      if (data.enterpriseType) {
        updateExpressions.push('#type = :type');
        expressionAttributeNames['#type'] = 'enterpriseType';
        expressionAttributeValues[':type'] = data.enterpriseType;
      }

      if (data.contactEmail) {
        updateExpressions.push('#email = :email');
        expressionAttributeNames['#email'] = 'contactEmail';
        expressionAttributeValues[':email'] = data.contactEmail.toString();
      }

      if (data.contactPhone) {
        updateExpressions.push('#phone = :phone');
        expressionAttributeNames['#phone'] = 'contactPhone';
        expressionAttributeValues[':phone'] = data.contactPhone;
      }

      // Siempre actualizar updatedAt
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const params = {
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const result = await this.dynamoDB.update(params).promise();
      return this.toAggregate(result.Attributes);
    } catch (error) {
      this.logger.error(`❌ Error al actualizar empresa: ${error.message}`);
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.dynamoDB.update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET isActive = :isActive',
        ExpressionAttributeValues: {
          ':isActive': false
        }
      }).promise();
      
      this.logger.log(`✅ Empresa eliminada (soft delete): ${id}`);
    } catch (error) {
      this.logger.error(`❌ Error al eliminar empresa: ${error.message}`);
      throw error;
    }
  }

  private toAggregate(item: any): EnterpriseAggregate {
    return EnterpriseAggregate.create({
      taxId: item.taxId,
      legalBusinessName: item.legalBusinessName,
      enterpriseType: item.enterpriseType,
      contactEmail: item.contactEmail,
      contactPhone: item.contactPhone
    });
  }
}
