import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const createVendorSchema = Joi.object({
    vendor_name: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': validationMessages.required('Name'),
            'string.min': validationMessages.minLength('Name', 2),
            'string.max': validationMessages.maxLength('Name', 100),
        }),

    vendor_address: Joi.string()
        .required()
        .min(5)
        .max(200)
        .messages({
            'string.empty': validationMessages.required('Address'),
            'string.min': validationMessages.minLength('Address', 5),
            'string.max': validationMessages.maxLength('Address', 200),
        }),
});

export const updateVendorSchema = createVendorSchema.fork(
    ['vendor_name', 'vendor_address'],
    schema => schema.optional(),
);
