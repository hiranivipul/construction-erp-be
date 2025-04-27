import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const createMaterialSchema = Joi.object({
    vendorId: Joi.string()
        .required()
        .uuid({ version: 'uuidv4' })
        .messages({
            'string.empty': validationMessages.required('Vendor ID'),
            'string.guid': 'Invalid vendor ID format',
            'string.uuid': 'Vendor ID must be a valid UUID v4',
        }),

    materialTypeId: Joi.string()
        .required()
        .uuid({ version: 'uuidv4' })
        .messages({
            'string.empty': validationMessages.required('Material Type ID'),
            'string.guid': 'Invalid material type ID format',
            'string.uuid': 'Material Type ID must be a valid UUID v4',
        }),

    projectId: Joi.string()
        .required()
        .uuid({ version: 'uuidv4' })
        .messages({
            'string.empty': validationMessages.required('Project ID'),
            'string.guid': 'Invalid project ID format',
            'string.uuid': 'Project ID must be a valid UUID v4',
        }),

    receipt: Joi.string()
        .required()
        .messages({
            'string.max': validationMessages.maxLength('Receipt', 255),
        }),

    // billDate: Joi.date().allow(null).optional().messages({
    //     'date.base': 'Invalid bill date format',
    // }),
});

export const updateMaterialSchema = createMaterialSchema.fork(
    ['vendorId', 'materialTypeId', 'projectId', 'receipt'],
    schema => schema.optional(),
);

export const validateMaterialInput = (data: any, isUpdate = false) => {
    const schema = isUpdate ? updateMaterialSchema : createMaterialSchema;
    return schema.validate(data, { abortEarly: false });
};
