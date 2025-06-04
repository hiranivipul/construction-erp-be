'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('expenses', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            expense_scope: {
                type: Sequelize.ENUM('project', 'company'),
                allowNull: false,
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            amount: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            created_by: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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

        // Add a constraint to ensure project_id is not null when expense_scope is 'project'
        await queryInterface.sequelize.query(`
            ALTER TABLE expenses
            ADD CONSTRAINT check_project_expense
            CHECK (
                (expense_scope = 'project' AND project_id IS NOT NULL) OR
                (expense_scope = 'company' AND project_id IS NULL)
            );
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('expenses');
    },
};
