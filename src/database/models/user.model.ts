import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { UserRole } from '@/constants/roles';

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: UserRole;
    organization_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
    UserAttributes,
    'id' | 'avatar' | 'createdAt' | 'updatedAt' | 'organization_id'
>;

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public avatar?: string;
    public role!: UserRole;
    public organization_id!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof User {
    User.init(
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
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            role: {
                type: DataTypes.ENUM(...Object.values(UserRole)),
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
            tableName: 'users',
            timestamps: true,
        },
    );

    return User;
}
