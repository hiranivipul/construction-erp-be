'use strict';

const { ProjectStatusValues } = require('../../constants/project');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('projects', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
            },
            project_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            client: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            construction_site: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            value: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM(
                    ProjectStatusValues.PENDING,
                    ProjectStatusValues.CONFIRM,
                    ProjectStatusValues.ONGOING,
                    ProjectStatusValues.COMPLETED,
                    ProjectStatusValues.ON_HOLD,
                    ProjectStatusValues.LEAVE,
                    ProjectStatusValues.CANCELLED,
                ),
                allowNull: false,
                defaultValue: 'pending',
            },
            organization_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add composite unique constraint for project_name and organization_id
        await queryInterface.addConstraint('projects', {
            fields: ['project_name', 'organization_id'],
            type: 'unique',
            name: 'projects_project_name_organization_id_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('projects');
    },
};
