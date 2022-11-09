export class StoreException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreException";
  }
}
