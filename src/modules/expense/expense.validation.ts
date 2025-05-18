import Joi from 'joi';
import { validationMessages } from '@utils/validation';

export const createExpenseSchema = Joi.object({
    date: Joi.date().optional().default(new Date()).messages({
        'date.base': 'Invalid date format',
    }),

    expense_scope: Joi.string()
        .valid('project', 'company')
        .required()
        .messages({
            'string.empty': validationMessages.required('Expense scope'),
            'any.only': 'Expense scope must be either project or company',
        }),

    project_id: Joi.string()
        .uuid({ version: 'uuidv4' })
        .when('expense_scope', {
            is: 'project',
            then: Joi.required(),
            otherwise: Joi.allow(null),
        })
        .messages({
            'string.empty': validationMessages.required('Project ID'),
            'string.guid': 'Invalid project ID format',
            'string.uuid': 'Project ID must be a valid UUID v4',
            'any.required':
                'Project ID is required when expense scope is project',
        }),

    vendor_id: Joi.string()
        .allow(null)
        .uuid({ version: 'uuidv4' })
        .optional()
        .messages({
            'string.empty': validationMessages.required('Vendor ID'),
            'string.guid': 'Invalid vendor ID format',
            'string.uuid': 'Vendor ID must be a valid UUID v4',
        }),

    description: Joi.string().optional().allow(null, '').messages({
        'string.base': 'Description must be a string',
    }),

    amount: Joi.number()
        .required()
        .min(0.01)
        .precision(2)
        .messages({
            'number.base': 'Amount must be a number',
            'number.min': 'Amount must be greater than 0',
            'number.precision': 'Amount can have maximum 2 decimal places',
            'any.required': validationMessages.required('Amount'),
        }),
});

export const updateExpenseSchema = createExpenseSchema.fork(
    [
        'expense_scope',
        'project_id',
        'vendor_id',
        'description',
        'amount',
        'date',
    ],
    schema => schema.optional(),
);

export const validateExpenseInput = (data: any, isUpdate = false) => {
    const schema = isUpdate ? updateExpenseSchema : createExpenseSchema;
    return schema.validate(data, { abortEarly: false });
};
