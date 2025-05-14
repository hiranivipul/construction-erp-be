import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import { Expense } from '@database/models/expense';
import { Project } from '@database/models/project.model';
import { User } from '@database/models/user.model';
import { CreateExpenseDto, UpdateExpenseDto } from './expense.dto';

export interface ListExpensesParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ListExpensesResult {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
}

export const createExpense = async (
    data: CreateExpenseDto,
    userId: string,
): Promise<Expense> => {
    try {
        // Validate project_id if expense_scope is project
        if (data.expense_scope === 'project' && !data.project_id) {
            throw new Error('Project ID is required for project expenses');
        }

        const expense = await Expense.create({
            ...data,
            created_by: userId,
        });

        return await Expense.findByPk(expense.id, {
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'projectName'],
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name'],
                },
            ],
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        throw error;
    }
};

export const listExpenses = async ({
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
}: ListExpensesParams): Promise<ListExpensesResult> => {
    try {
        const offset = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where[Op.or] = [
                { description: { [Op.iLike]: `%${search}%` } },
                {
                    expense_scope:
                        search.toLowerCase() === 'project'
                            ? 'project'
                            : search.toLowerCase() === 'company'
                            ? 'company'
                            : null,
                },
            ];
        }

        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const { count, rows } = await Expense.findAndCountAll({
            where,
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'projectName'],
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['created_at', 'DESC']],
            offset,
            limit,
        });

        return {
            data: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        };
    } catch (error) {
        console.error('Error listing expenses:', error);
        throw error;
    }
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
    return await Expense.findByPk(id, {
        include: [
            {
                model: Project,
                as: 'project',
                attributes: ['id', 'projectName'],
            },
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'name'],
            },
        ],
    });
};

export const updateExpense = async (
    id: string,
    data: UpdateExpenseDto,
): Promise<Expense | null> => {
    const expense = await Expense.findByPk(id);
    if (!expense) return null;

    return await expense.update(data);
};

export const deleteExpense = async (id: string): Promise<boolean> => {
    const expense = await Expense.findByPk(id);
    if (!expense) return false;

    await expense.destroy();
    return true;
};

export const exportExpenses = async (
    startDate?: Date,
    endDate?: Date,
): Promise<ExcelJS.Buffer> => {
    try {
        const where: any = {};
        if (startDate && endDate) {
            where.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const expenses = await Expense.findAll({
            where,
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['projectName'],
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['name'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenses');

        // Add headers
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Expense Scope', key: 'expense_scope', width: 15 },
            { header: 'Project', key: 'project', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Created By', key: 'created_by', width: 20 },
        ];

        // Add data rows
        expenses.forEach(expenseData => {
            worksheet.addRow({
                date: expenseData.date,
                expense_scope: expenseData.expense_scope,
                project: expenseData.project?.projectName || 'N/A',
                description: expenseData.description || 'N/A',
                amount: expenseData.amount,
                created_by: expenseData.creator?.name || 'N/A',
            });
        });

        // Style the header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' },
        };

        // Format amount column as currency
        worksheet.getColumn('amount').numFmt = '"₹"#,##0.00';

        // Format date column
        worksheet.getColumn('date').numFmt = 'dd/mm/yyyy';

        return await workbook.xlsx.writeBuffer();
    } catch (error) {
        console.error('Error exporting expenses:', error);
        throw error;
    }
};
