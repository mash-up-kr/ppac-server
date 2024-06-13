class CustomError extends Error {
  public status: number;

  constructor(message: string, status: number, stack?: string) {
    super(message);

    this.name = 'CustomError';
    this.status = status;

    if (stack) {
      this.stack = stack;
    }
  }
}

export default CustomError;
