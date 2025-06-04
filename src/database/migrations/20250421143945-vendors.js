'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vendors', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
            },
            vendor_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            vendor_address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            organization_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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

        // Add composite unique constraint for vendor_name and organization_id
        await queryInterface.addConstraint('vendors', {
            fields: ['vendor_name', 'organization_id'],
            type: 'unique',
            name: 'vendors_vendor_name_organization_id_unique'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('vendors');
    },
};
