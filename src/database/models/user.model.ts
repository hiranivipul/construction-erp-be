import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum UserRoleEnum {
    SUPER_ADMIN = 'super_admin',
    ACCOUNTANT = 'accountant',
    USER = 'user',
}

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: UserRoleEnum;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
    UserAttributes,
    'id' | 'createdAt' | 'updatedAt'
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
    public role!: UserRoleEnum;
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
                unique: true,
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
                type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
                allowNull: false,
                defaultValue: UserRoleEnum.USER,
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
