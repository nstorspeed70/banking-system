/**
 * Base interface for all domain events
 */
export interface DomainEvent {
  /**
   * Unique identifier for the event
   */
  id: string;

  /**
   * Timestamp when the event occurred
   */
  timestamp: string;

  /**
   * Type of the event
   */
  eventType: string;

  /**
   * Event payload data
   */
  detail: Record<string, any>;
}

/**
 * Base class for domain events with common functionality
 */
export abstract class BaseDomainEvent implements DomainEvent {
  public readonly id: string;
  public readonly timestamp: string;
  public abstract readonly eventType: string;
  public abstract readonly detail: Record<string, any>;

  constructor() {
    this.id = `evt-${Date.now()}`;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Convert event to EventBridge format
   */
  public toEventBridge() {
    return {
      EventBusName: 'sistema-bancario-events',
      Source: 'sistema-bancario.domain',
      DetailType: this.eventType,
      Detail: JSON.stringify(this.detail)
    };
  }
}
