export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string): AppError {
        return new AppError(400, message);
    }

    static unauthorized(message: string): AppError {
        return new AppError(401, message);
    }

    static forbidden(message: string): AppError {
        return new AppError(403, message);
    }

    static notFound(message: string): AppError {
        return new AppError(404, message);
    }

    static conflict(message: string): AppError {
        return new AppError(409, message);
    }

    static internal(message: string): AppError {
        return new AppError(500, message);
    }
}
