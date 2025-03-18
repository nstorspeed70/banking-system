/**
 * Query for retrieving an enterprise by ID
 * Part of CQRS read model
 */
export class GetEnterpriseQuery {
  constructor(public readonly id: string) {}
}
