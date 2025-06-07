import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum ProjectStatusEnum {
    PENDING = 'pending',
    CONFIRM = 'confirm',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    STOP = 'stop',
    LEAVE = 'leave',
}

export interface ProjectAttributes {
    id: string;
    project_name: string;
    client: string;
    constructionSite: string;
    startDate: Date;
    endDate?: Date;
    value: number;
    status: ProjectStatusEnum;
    organization_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ProjectCreationAttributes = Optional<
    ProjectAttributes,
    'id' | 'endDate' | 'createdAt' | 'updatedAt' | 'organization_id'
>;

export class Project
    extends Model<ProjectAttributes, ProjectCreationAttributes>
    implements ProjectAttributes
{
    public id!: string;
    public project_name!: string;
    public client!: string;
    public constructionSite!: string;
    public startDate!: Date;
    public endDate?: Date;
    public value!: number;
    public status!: ProjectStatusEnum;
    public organization_id!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Project {
    Project.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            project_name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'project_name',
                unique: true,
            },
            client: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            constructionSite: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'construction_site',
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'start_date',
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'end_date',
            },
            value: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(...Object.values(ProjectStatusEnum)),
                allowNull: false,
                defaultValue: ProjectStatusEnum.PENDING,
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
        },
        {
            sequelize,
            tableName: 'projects',
            timestamps: true,
            underscored: true,
        },
    );

    return Project;
}
