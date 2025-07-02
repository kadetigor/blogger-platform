export class repositoryNotFoundError extends Error { }
export class BadRequestError extends Error {
    statusCode = 400;
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}