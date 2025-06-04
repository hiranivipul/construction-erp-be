'use strict';

const { UserRoleValues } = require('../../constants/roles');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            role: {
                type: Sequelize.ENUM(
                    UserRoleValues.SUPER_ADMIN,
                    UserRoleValues.ADMIN,
                    UserRoleValues.ACCOUNTANT,
                    UserRoleValues.PROJECT_MANAGER,
                    UserRoleValues.SITE_ENGINEER,
                    UserRoleValues.SUPERVISOR,
                ),
                allowNull: false,
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

        // Add composite unique constraint for email and organization_id
        await queryInterface.addConstraint('users', {
            fields: ['email', 'organization_id'],
            type: 'unique',
            name: 'users_email_organization_id_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
