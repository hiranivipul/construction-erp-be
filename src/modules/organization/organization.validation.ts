import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const createOrganizationSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': validationMessages.required('Organization Name'),
            'string.min': validationMessages.minLength('Organization Name', 2),
            'string.max': validationMessages.maxLength(
                'Organization Name',
                100,
            ),
        }),

    address: Joi.string()
        .allow(null, '')
        .max(500)
        .messages({
            'string.max': validationMessages.maxLength('Address', 500),
        }),

    contact_no: Joi.string()
        .allow(null, '')
        .pattern(/^[0-9+\-\s()]*$/)
        .max(20)
        .messages({
            'string.pattern.base': 'Invalid contact number format',
            'string.max': validationMessages.maxLength('Contact Number', 20),
        }),

    code: Joi.string()
        .required()
        .pattern(/^[A-Z]{2}\d{4}$/)
        .messages({
            'string.empty': validationMessages.required('Organization Code'),
            'string.pattern.base':
                'Organization code must be 2 uppercase letters followed by 4 digits (e.g., AB1234)',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email address',
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': validationMessages.required('Password'),
            'string.min': validationMessages.minLength('Password', 8),
            'string.max': validationMessages.maxLength('Password', 100),
        }),
});

export const updateOrganizationSchema = createOrganizationSchema.fork(
    ['name', 'address', 'contact_no', 'code'],
    schema => schema.optional(),
);

export const validateOrganizationInput = (data: any, isUpdate = false) => {
    const schema = isUpdate
        ? updateOrganizationSchema
        : createOrganizationSchema;
    return schema.validate(data, { abortEarly: false });
};
