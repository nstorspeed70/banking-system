import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEnterpriseRepository } from '../../../domain/repositories/enterprise.repository.interface';
import { EnterpriseAggregate } from '../../../domain/aggregates/enterprise/enterprise.aggregate';
import { EnterpriseEntity } from '../../entities/enterprise.entity';
import { TaxId } from '../../../domain/value-objects/tax-id.value-object';
import { Email } from '../../../domain/value-objects/email.value-object';

@Injectable()
export class PostgresqlEnterpriseRepository implements IEnterpriseRepository {
  private readonly logger = new Logger(PostgresqlEnterpriseRepository.name);

  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: Repository<EnterpriseEntity>,
  ) {}

  async save(enterprise: EnterpriseAggregate): Promise<EnterpriseAggregate> {
    try {
      const entity = this.toEntity(enterprise);
      const savedEntity = await this.enterpriseRepository.save(entity);
      return this.toAggregate(savedEntity);
    } catch (error) {
      this.logger.error(`Error al guardar empresa: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<EnterpriseAggregate | null> {
    try {
      const entity = await this.enterpriseRepository.findOne({
        where: { id: parseInt(id), isActive: true }
      });

      return entity ? this.toAggregate(entity) : null;
    } catch (error) {
      this.logger.error(`Error al buscar empresa por ID: ${error.message}`);
      throw error;
    }
  }

  async findByTaxId(taxId: string): Promise<EnterpriseAggregate | null> {
    try {
      const entity = await this.enterpriseRepository.findOne({
        where: { taxId, isActive: true }
      });

      return entity ? this.toAggregate(entity) : null;
    } catch (error) {
      this.logger.error(`Error al buscar empresa por Tax ID: ${error.message}`);
      throw error;
    }
  }

  async findAll(filter?: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: EnterpriseAggregate[]; total: number }> {
    try {
      const query = this.enterpriseRepository.createQueryBuilder('enterprise')
        .where('enterprise.isActive = :isActive', { isActive: true });

      if (filter?.enterpriseType) {
        query.andWhere('enterprise.enterpriseType = :type', { type: filter.enterpriseType });
      }

      const [entities, total] = await query
        .skip(((filter?.page || 1) - 1) * (filter?.limit || 10))
        .take(filter?.limit || 10)
        .getManyAndCount();

      return {
        items: entities.map(entity => this.toAggregate(entity)),
        total
      };
    } catch (error) {
      this.logger.error(`Error al listar empresas: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<EnterpriseAggregate>): Promise<EnterpriseAggregate> {
    try {
      const entity = await this.enterpriseRepository.findOne({
        where: { id: parseInt(id), isActive: true }
      });

      if (!entity) {
        throw new Error(`Empresa con ID ${id} no encontrada`);
      }

      // Actualizar solo los campos proporcionados
      if (data.legalBusinessName) entity.legalBusinessName = data.legalBusinessName;
      if (data.taxId) entity.taxId = data.taxId.toString();
      if (data.enterpriseType) entity.enterpriseType = data.enterpriseType;
      if (data.contactEmail) entity.contactEmail = data.contactEmail.toString();
      if (data.contactPhone) entity.contactPhone = data.contactPhone;

      const savedEntity = await this.enterpriseRepository.save(entity);
      return this.toAggregate(savedEntity);
    } catch (error) {
      this.logger.error(`Error al actualizar empresa: ${error.message}`);
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.enterpriseRepository.update(
        { id: parseInt(id) },
        { isActive: false }
      );
    } catch (error) {
      this.logger.error(`Error al eliminar empresa: ${error.message}`);
      throw error;
    }
  }

  private toEntity(aggregate: EnterpriseAggregate): EnterpriseEntity {
    const entity = new EnterpriseEntity();
    if (aggregate.id) entity.id = parseInt(aggregate.id);
    entity.legalBusinessName = aggregate.legalBusinessName;
    entity.taxId = aggregate.taxId.toString();
    entity.enterpriseType = aggregate.enterpriseType;
    entity.contactEmail = aggregate.contactEmail.toString();
    entity.contactPhone = aggregate.contactPhone;
    entity.isActive = true;
    return entity;
  }

  private toAggregate(entity: EnterpriseEntity): EnterpriseAggregate {
    const taxId = TaxId.create(entity.taxId);
    const email = Email.create(entity.contactEmail);
    
    return new EnterpriseAggregate(
      entity.id.toString(),
      taxId,
      entity.legalBusinessName,
      entity.enterpriseType,
      email,
      entity.contactPhone
    );
  }
}
