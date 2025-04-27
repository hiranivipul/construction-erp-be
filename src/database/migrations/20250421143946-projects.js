'use strict';

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
            project_code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            budget: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('active', 'completed', 'on_hold', 'cancelled'),
                allowNull: false,
                defaultValue: 'active',
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