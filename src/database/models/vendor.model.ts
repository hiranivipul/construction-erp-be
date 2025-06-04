import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface VendorAttributes {
    id: string;
    vendor_name: string;
    vendor_address: string
    organization_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type VendorCreationAttributes = Optional<
    VendorAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export class Vendor
    extends Model<VendorAttributes, VendorCreationAttributes>
    implements VendorAttributes
{
    public id!: string;
    public vendor_address!: string;
    public vendor_name!: string;
    public organization_id!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Vendor {
    Vendor.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            vendor_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            vendor_address: {
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
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'vendors',
            timestamps: true,
        },
    );

    return Vendor;
}
