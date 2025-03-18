import { InvalidTaxIdFormatException } from '../exceptions';

/**
 * Objeto de valor que representa un ID fiscal
 * Encapsula las reglas de validaciu00f3n y comportamiento
 */
export class TaxId {
  private readonly value: string;
  
  private constructor(value: string) {
    this.validateTaxId(value);
    this.value = value;
  }
  
  private validateTaxId(value: string): void {
    if (!/^[A-Z0-9]{9,15}$/.test(value)) {
      throw new InvalidTaxIdFormatException(value);
    }
  }
  
  /**
   * Crea una nueva instancia de TaxId validando el formato
   * @param value Valor del ID fiscal
   * @throws InvalidTaxIdFormatException si el formato es invu00e1lido
   */
  static create(value: string): TaxId {
    return new TaxId(value);
  }
  
  /**
   * Compara si dos IDs fiscales son iguales
   */
  equals(other: TaxId): boolean {
    return this.value === other.value;
  }
  
  /**
   * Devuelve la representaciu00f3n en cadena del ID fiscal
   */
  toString(): string {
    return this.value;
  }
  
  /**
   * Get the raw value of the Tax ID
   */
  getValue(): string {
    return this.value;
  }
}
