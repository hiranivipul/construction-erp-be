'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('projects', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            project_name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
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
                    'pending',
                    'confirm',
                    'ongoing',
                    'completed',
                    'stop',
                    'leave',
                ),
                allowNull: false,
                defaultValue: 'pending',
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('projects');
    },
};
