import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const createVendorSchema = Joi.object({
    vendorName: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': validationMessages.required('Name'),
            'string.min': validationMessages.minLength('Name', 2),
            'string.max': validationMessages.maxLength('Name', 100),
        }),



    vendorAddress: Joi.string()
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
    [
        'vendorName',
        'vendorAddress',
    ],
    schema => schema.optional(),
);
