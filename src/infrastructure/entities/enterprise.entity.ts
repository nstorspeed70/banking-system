import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { EnterpriseType } from '../../domain/enums/enterprise-type.enum';
import { PartyEntity } from './party.entity';

@Entity('enterprises')
export class EnterpriseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'legal_business_name', length: 100 })
  legalBusinessName: string;

  @Column({ name: 'tax_id', length: 15, unique: true })
  taxId: string;

  @Column({ 
    name: 'enterprise_type',
    type: 'enum',
    enum: EnterpriseType,
  })
  enterpriseType: EnterpriseType;

  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({ name: 'contact_phone', length: 20 })
  contactPhone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => PartyEntity, party => party.enterprises)
  parties: PartyEntity[];
}
