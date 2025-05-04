import {
    Material,
    MaterialAttributes,
    MaterialCreationAttributes,
} from '@database/models/material.model';
import { MaterialType } from '@database/models/material-type.model';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import { Vendor } from '@database/models/vendor.model';
import { Project } from '@database/models/project.model';
import { S3Service } from '@utils/third-party/s3/s3.service';

interface ListMaterialsParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
}

interface ListMaterialsResult {
    data: Material[];
    total: number;
    page: number;
    totalPages: number;
}

interface ThinMaterial {
    id: string;
    vendorId: string;
    materialTypeId: string;
    projectId: string;
}

const organizationPrefix = 'ca8484';
export const createMaterial = async (
    input: MaterialCreationAttributes,
): Promise<Material> => {
    try {
        if (input.receipt && input.receipt.startsWith('data:image')) {
            const s3Service = new S3Service();
            const base64Data = input.receipt.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            // Detect content type and extension from base64 string
            const contentType = input.receipt.split(';')[0].split(':')[1];
            const extension = contentType.split('/')[1];

            // Generate unique key for the image with extension
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const key = `${organizationPrefix}/material-invoice/${timestamp}-${randomString}.${extension}`;

            // Upload to S3
            input.receipt = await s3Service.uploadFile(
                buffer,
                key,
                contentType,
            );
        }

        return await Material.create(input);
    } catch (error) {
        console.error('Error creating material:', error);
        throw error;
    }
};

export const listMaterials = async (
    params: ListMaterialsParams,
): Promise<ListMaterialsResult> => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
        where[Op.or] = [{ receipt: { [Op.iLike]: `%${params.search}%` } }];
    }

    if (params.startDate && params.endDate) {
        where.billDate = {
            [Op.between]: [params.startDate, params.endDate],
        };
    }

    const { count, rows } = await Material.findAndCountAll({
        where,
        attributes: [
            'id',
            'receipt',
            'billDate',
            'createdAt',
            'updatedAt',
            'vendorId',
            'materialTypeId',
            'projectId',
            'unit',
            'quantity',
        ],
        include: [
            {
                model: MaterialType,
                as: 'materialType',
                attributes: ['id', 'name'],
            },
            {
                model: Vendor,
                as: 'vendor',
                attributes: ['id', 'vendorName'],
            },
            {
                model: Project,
                as: 'project',
                attributes: ['id', 'projectName'],
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    // Generate signed URLs for receipt images
    const s3Service = new S3Service();
    const materialsWithSignedUrls = await Promise.all(
        rows.map(async material => {
            const materialData = material.toJSON();
            if (materialData.receipt) {
                const signedUrl = await s3Service.getSignedUrl(
                    materialData.receipt,
                );
                return {
                    ...materialData,
                    receipt: signedUrl,
                };
            }
            return materialData;
        }),
    );

    return {
        data: materialsWithSignedUrls as any,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
    };
};

export const getMaterialById = async (id: string): Promise<Material | null> => {
    return Material.findByPk(id, {
        include: [
            {
                model: MaterialType,
                as: 'materialType',
            },
            {
                model: Vendor,
                as: 'vendor',
            },
            {
                model: Project,
                as: 'project',
            },
        ],
    });
};

export const updateMaterial = async (
    id: string,
    input: Partial<MaterialAttributes>,
): Promise<Material | null> => {
    const material = await Material.findByPk(id);
    if (!material) {
        return null;
    }
    if (input.receipt && input.receipt.startsWith('data:image')) {
        const s3Service = new S3Service();
        const base64Data = input.receipt.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Detect content type and extension from base64 string
        const contentType = input.receipt.split(';')[0].split(':')[1];
        const extension = contentType.split('/')[1];

        // Generate unique key for the image with extension
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const key = `${organizationPrefix}/material-invoice/${timestamp}-${randomString}.${extension}`;
        const materialCurrent = await getMaterialById(id);
        await s3Service.deleteFile(materialCurrent?.receipt);
        // Upload to S3
        input.receipt = await s3Service.uploadFile(buffer, key, contentType);
    }
    return material.update(input);
};

export const deleteMaterial = async (id: string): Promise<boolean> => {
    const material = await Material.findByPk(id);
    if (!material) {
        return false;
    }
    await material.destroy();
    return true;
};

export const listThinMaterials = async (
    search?: string,
): Promise<ThinMaterial[]> => {
    try {
        const whereClause = search
            ? {
                  receipt: {
                      [Op.iLike]: `%${search}%`,
                  },
              }
            : {};

        return await Material.findAll({
            where: whereClause,
            attributes: ['id', 'vendorId', 'materialTypeId', 'projectId'],
            order: [['createdAt', 'ASC']],
        });
    } catch (error) {
        console.error('Error listing thin materials:', error);
        throw error;
    }
};

export const exportMaterials = async (
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

    const where: any = {};
    if (startDate && endDate) {
        where.billDate = {
            [Op.between]: [startDate, endDate],
        };
    }

    const materials = await Material.findAll({
        where,
        include: [
            {
                model: MaterialType,
                as: 'materialType',
                attributes: ['name', 'slug'],
            },
            {
                model: Vendor,
                as: 'vendor',
                attributes: ['vendorName'],
            },
            {
                model: Project,
                as: 'project',
                attributes: ['projectName'],
            },
        ],
        order: [['billDate', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Materials');

    // Define Excel headers
    worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Material Type', key: 'materialType', width: 20 },
        { header: 'Material Type', key: 'materialSlug', width: 20 },
        { header: 'Unit', key: 'unit', width: 5 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Vendor', key: 'vendor', width: 20 },
        { header: 'Project', key: 'project', width: 20 },
        { header: 'Receipt Date', key: 'billDate', width: 15 },
    ];

    // Add each material as a row
    let materialNo = 1;
    materials.forEach(material => {
        worksheet.addRow({
            no: materialNo,
            vendor: material.vendor?.vendorName,
            materialType: material.materialType?.name,
            unit: material.unit,
            quantity: material.quantity,
            materialSlug: material.materialType?.slug,
            project: material.project?.projectName,
            billDate: material.billDate,
        });
        materialNo++;
    });

    return await workbook.xlsx.writeBuffer();
};
