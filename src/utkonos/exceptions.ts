export class UtkonosAPIException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UtkonosAPIException";
  }
}
