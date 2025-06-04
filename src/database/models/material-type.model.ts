import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Material } from './material.model';

export interface MaterialTypeAttributes {
    id: string;
    name: string;
    slug: string;
    organization_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MaterialTypeCreationAttributes = Optional<
    MaterialTypeAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export class MaterialType
    extends Model<MaterialTypeAttributes, MaterialTypeCreationAttributes>
    implements MaterialTypeAttributes
{
    public id!: string;
    public name!: string;
    public slug!: string;
    public organization_id!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations
    public materials?: Material[];

    public static associate(models: any) {
        MaterialType.hasMany(models.Material, {
            foreignKey: 'materialTypeId',
            as: 'materials',
        });
    }
}

export default function (sequelize: Sequelize): typeof MaterialType {
    MaterialType.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
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
            tableName: 'material_types',
            timestamps: true,
            underscored: true,
            hooks: {
                beforeValidate: (materialType: MaterialType) => {
                    if (materialType.name) {
                        // Trim whitespace
                        const trimmedName = materialType.name.trim();
                        // Convert to lowercase and replace spaces with hyphens
                        materialType.slug = trimmedName
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-]/g, '');
                    }
                },
            },
        },
    );  

    return MaterialType;
}
