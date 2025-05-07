import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const registerSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': validationMessages.required('Name'),
            'any.required': validationMessages.required('Name'),
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': validationMessages.required('Email'),
            'string.email': 'Invalid email format',
            'any.required': validationMessages.required('Email'),
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': validationMessages.required('Password'),
            'string.min': 'Password must be at least 6 characters long',
            'any.required': validationMessages.required('Password'),
        }),

    organizationId: Joi.string()
        .required()
        .messages({
            'string.empty': validationMessages.required('Organization ID'),
            'any.required': validationMessages.required('Organization ID'),
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': validationMessages.required('Email'),
            'string.email': 'Invalid email format',
            'any.required': validationMessages.required('Email'),
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': validationMessages.required('Password'),
            'any.required': validationMessages.required('Password'),
        }),

    // organizationId: Joi.string()
    //     .required()
    //     .messages({
    //         'string.empty': validationMessages.required('Organization ID'),
    //         'any.required': validationMessages.required('Organization ID'),
    //     }),
});

export const validateLoginInput = (req: any, res: any, next: any) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message),
        });
    }
    next();
};
