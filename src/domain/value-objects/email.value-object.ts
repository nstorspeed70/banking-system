/**
 * Objeto de valor que representa un email
 * Encapsula las reglas de validaciu00f3n y comportamiento
 */
export class Email {
  private readonly _value: string;
  
  private constructor(value: string) {
    this.validateEmail(value);
    this._value = value;
  }
  
  /**
   * Crea una nueva instancia de Email validando el formato
   * @param value Valor del email
   * @throws Error si el formato es invu00e1lido
   */
  static create(value: string): Email {
    return new Email(value);
  }
  
  /**
   * Factory method for infrastructure layer to reconstruct Email from storage
   * @internal
   */
  static reconstitute(value: string): Email {
    const email = new Email(value);
    return email;
  }
  
  private validateEmail(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
  }
  
  /**
   * Get the email value
   */
  get value(): string {
    return this._value;
  }
  
  /**
   * Compara si dos emails son iguales
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }
  
  /**
   * Devuelve la representaciu00f3n en cadena del email
   */
  toString(): string {
    return this._value;
  }
  
  /**
   * Get value for JSON serialization
   */
  toJSON(): string {
    return this._value;
  }
}
