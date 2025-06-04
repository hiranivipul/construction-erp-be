import {
    Organization,
    OrganizationAttributes,
} from '@database/models/organization.model';
import { Op } from 'sequelize';
import {
    ListOrganizationsParams,
    ListOrganizationsResult,
    ThinOrganization,
    OrganizationCreationAttributes,
} from './organization.dto';
import { createDefaultMaterialTypes } from '../material-type/material-type.service';
import { AppError } from '@utils/app-error';
import { createUser } from '../auth/auth.service';
import { UserRole } from '@/constants/roles';
import { Request } from 'express';

export const createOrganization = async (
    input: OrganizationCreationAttributes,
    req: Request,
): Promise<Organization> => {
    // Check if organization with same code already exists
    const existingOrg = await Organization.findOne({
        where: { code: input.code },
    });

    if (existingOrg) {
        throw AppError.conflict('Organization with this code already exists');
    }

    // Create organization
    const organization = await Organization.create({
        name: input.name,
        code: input.code,
        address: input.address,
        contact_no: input.contact_no,
    });

    // Create default material types for the organization
    await createDefaultMaterialTypes(organization.id);
    // Create default user for the organization
    await createUser(
        {
            name: input.name,
            email: input.email,
            password: input.password,
            role: UserRole.ADMIN,
            organization_id: organization.id,
        },
        req,
    );

    return organization;
};

export const listOrganizations = async (
    params: ListOrganizationsParams,
): Promise<ListOrganizationsResult> => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
        where[Op.or] = [
            { name: { [Op.iLike]: `%${params.search}%` } },
            { code: { [Op.iLike]: `%${params.search}%` } },
        ];
    }

    const { count, rows } = await Organization.findAndCountAll({
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

export const getOrganizationById = async (
    id: string,
): Promise<Organization> => {
    const organization = await Organization.findOne({
        where: { id },
    });

    if (!organization) {
        throw AppError.notFound('Organization not found');
    }

    return organization;
};

export const updateOrganization = async (
    id: string,
    input: Partial<OrganizationAttributes>,
): Promise<Organization> => {
    const organization = await Organization.findOne({
        where: { id },
    });

    if (!organization) {
        throw AppError.notFound('Organization not found');
    }

    const updateData: Partial<OrganizationAttributes> = {};

    // Only update fields that are provided
    if (input.name) updateData.name = input.name;
    if (input.address !== undefined) updateData.address = input.address;
    if (input.contact_no !== undefined)
        updateData.contact_no = input.contact_no;
    if (input.code) updateData.code = input.code;

    return organization.update(updateData);
};

export const deleteOrganization = async (id: string): Promise<void> => {
    const organization = await Organization.findOne({
        where: { id },
    });

    if (!organization) {
        throw AppError.notFound('Organization not found');
    }

    await organization.destroy();
};

export const listThinOrganizations = async (
    search?: string,
): Promise<ThinOrganization[]> => {
    const whereClause: any = {};

    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.iLike]: `%${search}%` } },
            { code: { [Op.iLike]: `%${search}%` } },
        ];
    }

    return await Organization.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'code'],
        order: [['name', 'ASC']],
    });
};
