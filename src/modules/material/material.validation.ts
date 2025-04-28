import Joi from 'joi';
import { validationMessages, ValidationResult } from '@utils/validation';

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

// Image validation
export const validateImage = (base64Image: string): ValidationResult => {
    try {
        // Check if it's a valid base64 image string
        if (!base64Image.startsWith('data:image')) {
            return {
                isValid: false,
                errors: [
                    {
                        field: 'receipt',
                        message:
                            'Invalid image format. Image must be in base64 format starting with data:image',
                    },
                ],
            };
        }

        // Extract the base64 data
        const base64Data = base64Image.split(',')[1];
        if (!base64Data) {
            return {
                isValid: false,
                errors: [
                    {
                        field: 'receipt',
                        message: 'Invalid base64 image data',
                    },
                ],
            };
        }

        // Check if it's a valid base64 string
        const buffer = Buffer.from(base64Data, 'base64');

        // Check if the decoded data is a valid image
        const contentType = base64Image.split(';')[0].split(':')[1];
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(contentType)) {
            return {
                isValid: false,
                errors: [
                    {
                        field: 'receipt',
                        message:
                            'Invalid image format. Only JPEG, PNG, and GIF are supported',
                    },
                ],
            };
        }

        // Check if the image size is reasonable (e.g., less than 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
            return {
                isValid: false,
                errors: [
                    {
                        field: 'receipt',
                        message: 'Image size must be less than 5MB',
                    },
                ],
            };
        }

        return {
            isValid: true,
            value: base64Image,
        };
    } catch (error) {
        return {
            isValid: false,
            errors: [
                {
                    field: 'receipt',
                    message: 'Invalid image data',
                },
            ],
        };
    }
};
