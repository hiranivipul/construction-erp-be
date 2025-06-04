'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('organizations', {
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
            address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            contact_no: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            code: {
                type: Sequelize.STRING(6),
                allowNull: false,
                unique: true,
                validate: {
                    is: /^[A-Z]{2}\d{4}$/, // 2 uppercase letters followed by 4 digits
                },
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
        await queryInterface.dropTable('organizations');
    },
};
