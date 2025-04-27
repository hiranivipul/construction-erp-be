import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface VendorAttributes {
    id: string;
    vendorName: string;
    vendorAddress: string;
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
    public vendorAddress!: string;
    public vendorName!: string;
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
            vendorName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            vendorAddress: {
                type: DataTypes.STRING,
                allowNull: false,
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
