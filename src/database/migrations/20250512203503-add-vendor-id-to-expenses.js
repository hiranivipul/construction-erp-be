'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('expenses', 'vendor_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'vendors',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('expenses', 'vendor_id');
    },
};
