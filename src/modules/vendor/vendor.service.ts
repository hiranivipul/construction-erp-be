import {
    Vendor,
    VendorAttributes,
    VendorCreationAttributes,
} from '@database/models/vendor.model';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import { ListVendorsParams, ListVendorsResult, ThinVendor } from './vendor.dto';

export const createVendor = async (
    input: VendorCreationAttributes,
): Promise<Vendor> => {
    return Vendor.create(input);
};

export const listVendors = async (
    params: ListVendorsParams,
): Promise<ListVendorsResult> => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
        where[Op.or] = [{ vendor_name: { [Op.iLike]: `%${params.search}%` } }];
    }

    const { count, rows } = await Vendor.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
    });

    return {
        data: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
    };
};

export const getVendorById = async (id: string): Promise<Vendor | null> => {
    return Vendor.findByPk(id);
};

export const updateVendor = async (
    id: string,
    input: Partial<VendorAttributes>,
): Promise<Vendor | null> => {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
        return null;
    }
    return vendor.update(input);
};

export const deleteVendor = async (id: string): Promise<boolean> => {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
        return false;
    }
    await vendor.destroy();
    return true;
};

export const listThinVendors = async (
    search?: string,
): Promise<ThinVendor[]> => {
    try {
        const whereClause = search
            ? {
                  vendor_name: {
                      [Op.iLike]: `%${search}%`,
                  },
              }
            : {};

        return await Vendor.findAll({
            where: whereClause,
            attributes: ['id', 'vendor_name'],
            order: [['vendor_name', 'ASC']],
        });
    } catch (error) {
        console.error('Error listing thin vendors:', error);
        throw error;
    }
};

export const exportVendors = async (
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
        where.createdAt = {
            [Op.between]: [startDate, endDate],
        };
    }

    const vendors = await Vendor.findAll({
        where,
        order: [['createdAt', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vendors');

    // Define Excel headers
    worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Created At', key: 'createdAt', width: 15 },
    ];

    // Add each vendor as a row
    let vendorNo = 1;
    vendors.forEach(vendor => {
        worksheet.addRow({
            no: vendorNo,
            name: vendor.vendor_name,
            address: vendor.vendor_address,
            createdAt: vendor.createdAt,
        });
        vendorNo++;
    });

    return await workbook.xlsx.writeBuffer();
};
