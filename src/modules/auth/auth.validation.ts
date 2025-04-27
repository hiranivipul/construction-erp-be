import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': validationMessages.required('Email'),
            'string.email': 'Please provide a valid email address',
        }),
    password: Joi.string()
        .required()
        .min(6)
        .messages({
            'string.empty': validationMessages.required('Password'),
            'string.min': validationMessages.minLength('Password', 6),
        }),
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