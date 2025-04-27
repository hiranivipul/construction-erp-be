import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const createMaterialTypeSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': validationMessages.required('Material Type Name'),
            'string.min': validationMessages.minLength('Material Type Name', 2),
            'string.max': validationMessages.maxLength('Material Type Name', 100),
        }),
    description: Joi.string()
        .allow('')
        .optional()
        .max(500)
        .messages({
            'string.max': validationMessages.maxLength('Description', 500),
        }),
});

export const updateMaterialTypeSchema = createMaterialTypeSchema.fork(
    ['name', 'description'],
    schema => schema.optional(),
);

export interface CreateMaterialTypeInput {
    name: string;
    description?: string;
}

export interface UpdateMaterialTypeInput {
    name?: string;
    description?: string;
}
