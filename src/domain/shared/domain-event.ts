/**
 * Interface for domain events in the system
 */
export interface DomainEvent {
    /**
     * Get the name of the event
     */
    eventName(): string;

    /**
     * Get the timestamp when the event occurred
     */
    timestamp(): Date;

    /**
     * Get the event payload
     */
    payload(): any;
}
