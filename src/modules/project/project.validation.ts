import Joi from 'joi';
import { validationMessages } from '@utils/validation';
import { ProjectStatusEnum } from '@database/models/project.model';

export const createProjectSchema = Joi.object({
    project_name: Joi.string()
        .required()
        .min(3)
        .max(100)
        .messages({
            'string.empty': validationMessages.required('Project Name'),
            'string.min': validationMessages.minLength('Project Name', 3),
            'string.max': validationMessages.maxLength('Project Name', 100),
        }),

    client: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': validationMessages.required('Client'),
            'string.min': validationMessages.minLength('Client', 2),
            'string.max': validationMessages.maxLength('Client', 100),
        }),

    constructionSite: Joi.string()
        .required()
        .min(5)
        .max(200)
        .messages({
            'string.empty': validationMessages.required('Construction Site'),
            'string.min': validationMessages.minLength('Construction Site', 5),
            'string.max': validationMessages.maxLength(
                'Construction Site',
                200,
            ),
        }),

    startDate: Joi.date()
        .required()
        .messages({
            'date.base': validationMessages.required('Start Date'),
        }),

    endDate: Joi.date()
        .min(Joi.ref('startDate'))
        .allow(null)
        .optional()
        .messages({
            'date.min': 'End date must be after start date',
        }),

    value: Joi.number()
        .required()
        .min(0)
        .messages({
            'number.base': validationMessages.required('Project Value'),
            'number.min': 'Project value must be greater than 0',
        }),

    status: Joi.string()
        .valid(...Object.values(ProjectStatusEnum))
        .default(ProjectStatusEnum.PENDING)
        .messages({
            'any.only': 'Invalid project status',
        }),
});

export const updateProjectSchema = createProjectSchema.fork(
    [
        'project_name',
        'client',
        'constructionSite',
        'startDate',
        'endDate',
        'value',
        'status',
    ],
    schema => schema.optional(),
);

export const validateProjectInput = (data: any, isUpdate = false) => {
    const schema = isUpdate ? updateProjectSchema : createProjectSchema;
    return schema.validate(data, { abortEarly: false });
};
