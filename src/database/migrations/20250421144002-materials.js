'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('materials', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
                allowNull: false,
            },
            vendor_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id',
                },
            },
            material_type_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'material_types',
                    key: 'id',
                },
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'projects',
                    key: 'id',
                },
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
            receipt: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Path to the receipt image',
            },
            bill_date: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable('materials');
    },
};
