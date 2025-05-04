import { MaterialType } from '@database/models/material-type.model';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import { AppError } from '@utils/app-error';
import {
    ListMaterialTypesParams,
    ListMaterialTypesResult,
    ThinMaterialType,
    CreateMaterialTypeInput,
    UpdateMaterialTypeInput,
} from './material-type.dto';

export const createMaterialType = async (
    input: CreateMaterialTypeInput,
): Promise<MaterialType> => {
    // Check if material type with same name already exists
    const existingMaterialType = await MaterialType.findOne({
        where: { name: input.name },
    });

    if (existingMaterialType) {
        throw new AppError(400, 'Material type with this name already exists');
    }

    return MaterialType.create(input);
};

export const listMaterialTypes = async (
    params: ListMaterialTypesParams,
): Promise<ListMaterialTypesResult> => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
        where.name = {
            [Op.iLike]: `%${params.search}%`,
        };
    }

    const { count, rows } = await MaterialType.findAndCountAll({
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

export const getMaterialTypeById = async (
    id: string,
): Promise<MaterialType> => {
    const materialType = await MaterialType.findByPk(id);
    if (!materialType) {
        throw new AppError(404, 'Material type not found');
    }
    return materialType;
};

export const updateMaterialType = async (
    id: string,
    input: UpdateMaterialTypeInput,
): Promise<MaterialType> => {
    const materialType = await MaterialType.findByPk(id);
    if (!materialType) {
        throw new AppError(404, 'Material type not found');
    }

    // Check if new name already exists (excluding current record)
    if (input.name && input.name !== materialType.name) {
        const existingMaterialType = await MaterialType.findOne({
            where: {
                name: input.name,
                id: { [Op.ne]: id },
            },
        });

        if (existingMaterialType) {
            throw new AppError(
                400,
                'Material type with this name already exists',
            );
        }
    }

    return materialType.update(input);
};

export const deleteMaterialType = async (id: string): Promise<void> => {
    const materialType = await MaterialType.findByPk(id);
    if (!materialType) {
        throw new AppError(404, 'Material type not found');
    }

    await materialType.destroy();
};

export const listThinMaterialTypes = async (
    search?: string,
): Promise<ThinMaterialType[]> => {
    try {
        const whereClause = search
            ? {
                  name: {
                      [Op.iLike]: `%${search}%`,
                  },
              }
            : {};

        return await MaterialType.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'slug'],
            order: [['name', 'ASC']],
        });
    } catch (error) {
        console.error('Error listing thin material types:', error);
        throw error;
    }
};

export const exportMaterialTypes = async (
    startDate?: Date,
    endDate?: Date,
): Promise<ExcelJS.Buffer> => {
    // Validate date range if both dates are provided
    if (startDate && endDate) {
        const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const maxDaysInYear = 365;

        if (diffInDays > maxDaysInYear) {
            throw new AppError(400, 'Date range cannot exceed 1 year');
        }
    }

    const where: any = {};
    if (startDate && endDate) {
        where.createdAt = {
            [Op.between]: [startDate, endDate],
        };
    }

    const materialTypes = await MaterialType.findAll({
        where,
        attributes: ['id', 'name', 'slug'],
        order: [['createdAt', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Material Types');

    // Define Excel headers
    worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Material Code', key: 'slug', width: 15 },
    ];

    // Add each material type as a row
    let materialTypeNo = 1;
    materialTypes.forEach(materialType => {
        worksheet.addRow({
            no: materialTypeNo,
            name: materialType.name,
            slug: materialType.slug,
        });
        materialTypeNo++;
    });

    return await workbook.xlsx.writeBuffer();
};
