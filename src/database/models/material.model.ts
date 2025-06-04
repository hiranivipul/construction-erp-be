import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { MaterialType } from './material-type.model';
import { Vendor } from './vendor.model';
import { Project } from './project.model';

export type MaterialUnit = 'KG' | 'TONS' | 'NOS';

export interface MaterialAttributes {
    id: string;
    vendorId: string;
    materialTypeId: string;
    projectId: string;
    organization_id: string;
    receipt?: string;
    receiptImage?: string;
    billDate?: Date;
    unit: MaterialUnit;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MaterialCreationAttributes = Optional<
    MaterialAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export class Material
    extends Model<MaterialAttributes, MaterialCreationAttributes>
    implements MaterialAttributes
{
    public id!: string;
    public vendorId!: string;
    public materialTypeId!: string;
    public projectId!: string;
    public organization_id!: string;
    public receipt?: string;
    public receiptImage?: string;
    public readonly billDate?: Date;
    public unit!: MaterialUnit;
    public quantity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations
    public vendor?: Vendor;
    public materialType?: MaterialType;
    public project?: Project;

    public static associate(models: any) {
        Material.belongsTo(models.MaterialType, {
            foreignKey: 'materialTypeId',
            targetKey: 'id',
            as: 'materialType',
        });

        Material.belongsTo(models.Vendor, {
            foreignKey: 'vendorId',
            targetKey: 'id',
            as: 'vendor',
        });

        Material.belongsTo(models.Project, {
            foreignKey: 'projectId',
            targetKey: 'id',
            as: 'project',
        });
    }
}

export default function (sequelize: Sequelize): typeof Material {
    Material.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            vendorId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'vendor_id',
                references: {
                    model: 'vendors',
                    key: 'id',
                },
            },
            materialTypeId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'material_type_id',
                references: {
                    model: 'material_types',
                    key: 'id',
                },
            },
            projectId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'project_id',
                references: {
                    model: 'projects',
                    key: 'id',
                },
            },
            organization_id: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'organization_id',
                references: {
                    model: 'organizations',
                    key: 'id',
                },
            },
            receipt: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'Path to the receipt image',
            },
            billDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'bill_date',
            },
            unit: {
                type: DataTypes.ENUM('KG', 'TONS', 'NOS'),
                allowNull: false,
                defaultValue: 'NOS',
                field: 'unit',
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
                field: 'quantity',
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'updated_at',
            },
        },
        {
            sequelize,
            tableName: 'materials',
            timestamps: true,
            underscored: true,
        },
    );

    return Material;
}
