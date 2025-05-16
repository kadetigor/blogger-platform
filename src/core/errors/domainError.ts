export class domainError extends Error {
  constructor(
    detail: string,
    public readonly code: string,
    public readonly source?: string,
  ) {
    super(detail);
  }
}
