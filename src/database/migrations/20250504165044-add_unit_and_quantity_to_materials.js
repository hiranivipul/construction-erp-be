'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('materials', 'unit', {
            type: Sequelize.ENUM('KG', 'TONS', 'NOS'),
            allowNull: false,
            defaultValue: 'KG',
        });

        await queryInterface.addColumn('materials', 'quantity', {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('materials', 'unit');
        await queryInterface.removeColumn('materials', 'quantity');
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_materials_unit;',
        );
    },
};
