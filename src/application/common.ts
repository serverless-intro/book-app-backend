export class ObjectNotFoundError<ID> extends Error {
  static NAME = 'ObjectNotFoundError';

  constructor(objectName: string, objectId: ID) {
    super(`${objectName} with ID ${objectId} not found`);
    this.name = ObjectNotFoundError.NAME;
  }
}
