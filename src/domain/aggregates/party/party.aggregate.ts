import { AggregateRoot } from '../../shared/aggregate-root';
import { Email } from '../../value-objects/email.value-object';
import { PartyRole } from '../../enums/party-role.enum';
import { PartyCreatedEvent } from '../../events/party-created.event';
import { PartyUpdatedEvent } from '../../events/party-updated.event';

export class PartyAggregate extends AggregateRoot {
    private _id: string;
    private _name: string;
    private _email: Email;
    private _role: PartyRole;
    private _enterpriseId: string;
    private _isActive: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        name: string,
        email: Email,
        role: PartyRole,
        enterpriseId: string
    ) {
        super();
        this._id = id;
        this._name = name;
        this._email = email;
        this._role = role;
        this._enterpriseId = enterpriseId;
        this._isActive = true;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    // Getters
    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get email(): Email { return this._email; }
    get role(): PartyRole { return this._role; }
    get enterpriseId(): string { return this._enterpriseId; }
    get isActive(): boolean { return this._isActive; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    // Factory method
    static create(
        id: string,
        name: string,
        emailStr: string,
        role: PartyRole,
        enterpriseId: string
    ): PartyAggregate {
        const email = Email.create(emailStr);
        const party = new PartyAggregate(id, name, email, role, enterpriseId);
        party.addDomainEvent(new PartyCreatedEvent(party));
        return party;
    }

    // Factory method for reconstitution from storage
    static reconstitute(
        id: string,
        name: string,
        emailStr: string,
        role: PartyRole,
        enterpriseId: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ): PartyAggregate {
        const email = Email.reconstitute(emailStr);
        const party = new PartyAggregate(id, name, email, role, enterpriseId);
        party._isActive = isActive;
        party._createdAt = createdAt;
        party._updatedAt = updatedAt;
        return party;
    }

    // Update method
    update(
        name?: string,
        emailStr?: string,
        role?: PartyRole
    ): void {
        if (name) this._name = name;
        if (emailStr) this._email = Email.create(emailStr);
        if (role) this._role = role;
        
        this._updatedAt = new Date();
        this.addDomainEvent(new PartyUpdatedEvent(this));
    }

    // Soft delete
    delete(): void {
        this._isActive = false;
        this._updatedAt = new Date();
    }

    // Validation
    validate(): void {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Party name is required');
        }
        if (!this._email) {
            throw new Error('Party email is required');
        }
        if (!Object.values(PartyRole).includes(this._role)) {
            throw new Error('Invalid party role');
        }
        if (!this._enterpriseId) {
            throw new Error('Enterprise ID is required');
        }
    }
}
