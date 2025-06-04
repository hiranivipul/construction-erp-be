import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import userModel from './models/user.model';
import materialModel from './models/material.model';
import materialTypeModel from './models/material-type.model';
import projectModel from './models/project.model';
import vendorModel from './models/vendor.model';
import expenseModel from './models/expense.model';
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '@/config';
import organizationModel from '@database/models/organization.model';
import userOrganizationViewModel from './models/user-organization-view.model';

export const sequelize = new Sequelize.Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: '+09:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(time + 'ms' + ' ' + query);
        },
        benchmark: true,
    },
);

// Initialize models
const User = userModel(sequelize);
const Material = materialModel(sequelize);
const MaterialType = materialTypeModel(sequelize);
const Projects = projectModel(sequelize);
const Organizations = organizationModel(sequelize);
const Vendor = vendorModel(sequelize);
const Expense = expenseModel(sequelize);
const UserOrganizationView = userOrganizationViewModel(sequelize);
// Set up associations after all models are initialized
Object.values(sequelize.models).forEach(model => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (model.associate) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        model.associate(sequelize.models);
    }
});

sequelize.authenticate();

export const DB = {
    User,
    Material,
    MaterialType,
    Projects,
    Vendor,
    Expense,
    Organizations,
    UserOrganizationView,
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};
