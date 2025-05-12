import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Project } from './project.model';
import { User } from './user.model';

export type ExpenseScope = 'project' | 'company';

export interface ExpenseAttributes {
    id: string;
    date: Date;
    expense_scope: ExpenseScope;
    project_id: string | null;
    description: string | null;
    amount: number;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

export type ExpenseCreationAttributes = Optional<
    ExpenseAttributes,
    'id' | 'created_at' | 'updated_at'
>;

export class Expense extends Model<
    ExpenseAttributes,
    ExpenseCreationAttributes
> {
    public id!: string;
    public date!: Date;
    public expense_scope!: ExpenseScope;
    public project_id!: string | null;
    public description!: string | null;
    public amount!: number;
    public created_by!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    // Associations
    public project?: Project;
    public creator?: User;

    public static associate(models: any) {
        Expense.belongsTo(models.Project, {
            foreignKey: 'project_id',
            as: 'project',
        });

        Expense.belongsTo(models.User, {
            foreignKey: 'created_by',
            as: 'creator',
            targetKey: 'id',
        });
    }
}

export default function (sequelize: Sequelize): typeof Expense {
    Expense.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            expense_scope: {
                type: DataTypes.ENUM('project', 'company'),
                allowNull: false,
            },
            project_id: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'project_id',
                references: {
                    model: 'projects',
                    key: 'id',
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'created_by',
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'created_at',
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'updated_at',
            },
        },
        {
            sequelize,
            tableName: 'expenses',
            timestamps: true,
            underscored: true,
        },
    );

    return Expense;
}
