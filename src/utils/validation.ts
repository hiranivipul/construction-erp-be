import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors?: ValidationError[];
    value?: any;
}

export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const validationErrors: ValidationError[] = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }

        // Replace req.body with the validated value
        req.body = value;
        next();
    };
};

// Common validation messages
export const validationMessages = {
    required: (field: string) => `${field} is required`,
    invalidEmail: 'Please provide a valid email address',
    minLength: (field: string, length: number) => `${field} must be at least ${length} characters long`,
    maxLength: (field: string, length: number) => `${field} must not exceed ${length} characters`,
    invalidPhone: 'Please provide a valid phone number',
    invalidPostalCode: 'Please provide a valid postal code',
    invalidTaxId: 'Please provide a valid tax ID'
}; 