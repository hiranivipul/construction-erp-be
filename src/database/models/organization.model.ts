import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface OrganizationAttributes {
    id: string;
    name: string;
    address?: string;
    contact_no?: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type OrganizationCreationAttributes = Optional<
    OrganizationAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;



export class Organization
    extends Model<OrganizationAttributes, OrganizationCreationAttributes>
    implements OrganizationAttributes
{
    public id!: string;
    public name!: string;
    public address?: string;
    public contact_no?: string;
    public code!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Organization {
    Organization.init(
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
            address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            contact_no: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'contact_no',
            },
            code: {
                type: DataTypes.STRING(6),
                allowNull: false,
                unique: true,
                validate: {
                    is: /^[A-Z]{2}\d{4}$/, // 2 uppercase letters followed by 4 digits
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
            tableName: 'organizations',
            timestamps: true,
            underscored: true,
        },
    );

    return Organization;
}
