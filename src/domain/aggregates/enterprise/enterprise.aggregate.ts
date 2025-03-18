import { AggregateRoot } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TaxId } from '../../value-objects/tax-id.value-object';
import { Email } from '../../value-objects/email.value-object';
import { EnterpriseType } from '../../enums/enterprise-type.enum';
import { EnterpriseCreatedEvent } from '../../events/enterprise-created.event';

/**
 * Enterprise Aggregate Root
 * Encapsulates business rules and behavior for enterprises
 */
export class EnterpriseAggregate extends AggregateRoot {
  private readonly logger = new Logger(EnterpriseAggregate.name);

  constructor(
    public readonly id: string,
    public readonly taxId: TaxId,
    public readonly legalBusinessName: string,
    public readonly enterpriseType: EnterpriseType,
    public readonly contactEmail: Email,
    public readonly contactPhone: string,
  ) {
    super();
    this.logger.log(`Creando agregado de empresa: ${legalBusinessName}`);
  }

  /**
   * Create a new enterprise aggregate
   * Factory method that ensures all business rules are met
   */
  static create(props: {
    legalBusinessName: string;
    taxId: string;
    enterpriseType: EnterpriseType;
    contactEmail: string;
    contactPhone: string;
  }): EnterpriseAggregate {
    const logger = new Logger('EnterpriseAggregate');
    logger.log('Creando nueva empresa...');
    logger.debug('Datos de entrada:', props);

    // Create Value Objects
    logger.log('Creando objetos de valor...');
    const taxIdVO = TaxId.create(props.taxId);
    const emailVO = Email.create(props.contactEmail);

    // Create aggregate instance
    logger.log('Creando instancia del agregado...');
    const enterprise = new EnterpriseAggregate(
      Date.now().toString(),
      taxIdVO,
      props.legalBusinessName,
      props.enterpriseType,
      emailVO,
      props.contactPhone,
    );

    // Create and apply domain event
    logger.log('Generando evento de creación...');
    const event = EnterpriseCreatedEvent.fromAggregate(enterprise);
    logger.debug('Evento generado:', event);

    logger.log('Aplicando evento al agregado...');
    enterprise.apply(event);

    logger.log('Empresa creada exitosamente');
    return enterprise;
  }

  /**
   * Convert aggregate to JSON representation
   * Used for persistence and event publishing
   */
  toJSON() {
    return {
      id: this.id,
      taxId: this.taxId.toString(),
      legalBusinessName: this.legalBusinessName,
      enterpriseType: this.enterpriseType,
      contactEmail: this.contactEmail.toString(),
      contactPhone: this.contactPhone,
    };
  }
}
