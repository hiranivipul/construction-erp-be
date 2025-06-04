import {
    Project,
    ProjectAttributes,
    ProjectCreationAttributes,
    ProjectStatusEnum,
} from '@database/models/project.model';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import {
    ListProjectsParams,
    ListProjectsResult,
    ThinProject,
} from './project.dto';

export const createProject = async (
    input: ProjectCreationAttributes,
): Promise<Project> => {
    // Ensure all required fields are present and properly formatted
    const projectData: ProjectCreationAttributes = {
        project_name: input.project_name,
        client: input.client,
        constructionSite: input.constructionSite,
        startDate: new Date(input.startDate),
        value: Number(input.value),
        status: ProjectStatusEnum.PENDING,
        organization_id: input.organization_id,
    };

    // Add optional fields if they exist
    if (input.endDate) {
        projectData.endDate = new Date(input.endDate);
    }

    try {
        return await Project.create(projectData);
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

export const listProjects = async (
    params: ListProjectsParams,
): Promise<ListProjectsResult> => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {
        organization_id: params.organization_id,
    };

    if (params.search) {
        where[Op.or] = [
            { project_name: { [Op.iLike]: `%${params.search}%` } },
            { client: { [Op.iLike]: `%${params.search}%` } },
            { constructionSite: { [Op.iLike]: `%${params.search}%` } },
        ];
    }

    if (params.status) {
        where.status = params.status;
    }

    if (params.startDate && params.endDate) {
        where.startDate = {
            [Op.between]: [params.startDate, params.endDate],
        };
    }

    const { count, rows } = await Project.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        data: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
    };
};

export const getProjectById = async (
    id: string,
    organizationId: string,
): Promise<Project | null> => {
    return Project.findOne({
        where: {
            id,
            organization_id: organizationId,
        },
    });
};

export const exportProject = async (
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
): Promise<ExcelJS.Buffer> => {
    // Validate date range if both dates are provided
    if (startDate && endDate) {
        const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const maxDaysInYear = 365;

        if (diffInDays > maxDaysInYear) {
            throw new Error('Date range cannot exceed 1 year');
        }
    }

    const where: any = {
        organization_id: organizationId,
    };

    if (startDate && endDate) {
        where.startDate = {
            [Op.between]: [startDate, endDate],
        };
    }

    const projects = await Project.findAll({
        where,
        order: [['startDate', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projects');

    // Define Excel headers
    worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Name', key: 'name', width: 15 },
        { header: 'Client Name', key: 'client', width: 15 },
        { header: 'constructionSite', key: 'constructionSite', width: 40 },
        { header: 'Start Date', key: 'startDate', width: 10 },
        { header: 'End Date', key: 'endDate', width: 10 },
        { header: 'Value', key: 'value', width: 7 },
    ];

    // Add each project as a row
    let projectNo = 1;
    projects.forEach(project => {
        worksheet.addRow({
            id: projectNo,
            name: project.project_name,
            client: project.client,
            constructionSite: project.constructionSite,
            startDate: project.startDate,
            endDate: project.endDate,
            value: project.value,
        });
        projectNo++;
    });

    return await workbook.xlsx.writeBuffer();
};

export const updateProject = async (
    id: string,
    input: Partial<ProjectAttributes>,
): Promise<Project | null> => {
    const project = await Project.findOne({
        where: {
            id,
            organization_id: input.organization_id,
        },
    });

    if (!project) {
        return null;
    }

    const updateData: Partial<ProjectAttributes> = {};

    // Only update fields that are provided
    if (input.project_name) updateData.project_name = input.project_name;
    if (input.client) updateData.client = input.client;
    if (input.constructionSite)
        updateData.constructionSite = input.constructionSite;
    if (input.startDate) updateData.startDate = new Date(input.startDate);
    if (input.endDate) updateData.endDate = new Date(input.endDate);
    if (input.value) updateData.value = Number(input.value);
    if (input.status) updateData.status = input.status;

    return project.update(updateData);
};

export const deleteProject = async (
    id: string,
    organizationId: string,
): Promise<boolean> => {
    const project = await Project.findOne({
        where: {
            id,
            organization_id: organizationId,
        },
    });

    if (!project) {
        return false;
    }
    await project.destroy();
    return true;
};

export const listThinProjects = async (
    organizationId: string,
    search?: string,
): Promise<ThinProject[]> => {
    try {
        const whereClause: any = {
            organization_id: organizationId,
        };

        if (search) {
            whereClause.project_name = {
                [Op.iLike]: `%${search}%`,
            };
        }

        return await Project.findAll({
            where: whereClause,
            attributes: ['id', 'project_name'],
            order: [['project_name', 'ASC']],
        });
    } catch (error) {
        console.error('Error listing thin projects:', error);
        throw error;
    }
};
