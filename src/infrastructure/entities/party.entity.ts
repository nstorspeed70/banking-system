import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { EnterpriseEntity } from './enterprise.entity';

@Entity('parties')
export class PartyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'EMPLOYEE'],
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => EnterpriseEntity, enterprise => enterprise.parties)
  @JoinTable({
    name: 'enterprise_parties',
    joinColumn: {
      name: 'party_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'enterprise_id',
      referencedColumnName: 'id',
    },
  })
  enterprises: EnterpriseEntity[];
}
