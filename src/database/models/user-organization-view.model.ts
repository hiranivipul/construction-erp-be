import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserRole } from '@/constants/roles';

export interface UserOrganizationViewAttributes {
    // User fields
    user_id: string;
    user_name: string;
    user_email: string;
    user_password: string;
    user_avatar?: string;
    user_role: UserRole;
    user_created_at: Date;
    user_updated_at: Date;
    // Organization fields
    organization_id: string;
    organization_name: string;
    organization_code: string;
}

export class UserOrganizationView
    extends Model<UserOrganizationViewAttributes>
    implements UserOrganizationViewAttributes
{
    // User fields
    public user_id!: string;
    public user_name!: string;
    public user_email!: string;
    public user_password!: string;
    public user_avatar?: string;
    public user_role!: UserRole;
    public user_created_at!: Date;
    public user_updated_at!: Date;
    // Organization fields
    public organization_id!: string;
    public organization_name!: string;
    public organization_code!: string;
}

export default function (sequelize: Sequelize): typeof UserOrganizationView {
    UserOrganizationView.init(
        {
            // User fields
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            user_role: {
                type: DataTypes.ENUM(...Object.values(UserRole)),
                allowNull: false,
            },
            user_created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            user_updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            // Organization fields
            organization_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            organization_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organization_code: {
                type: DataTypes.STRING(6),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'UserOrganizationView',
            tableName: 'user_organization_view',
            timestamps: false,
        }
    );

    return UserOrganizationView;
} 