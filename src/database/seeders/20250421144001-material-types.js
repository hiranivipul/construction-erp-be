'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const materialTypes = [
            'Aggregate',
            'Grit',
            'Cement',
            'Steel 8mm',
            'Steel 10mm',
            'Sand',
            'Steel 12mm',
            'Steel 16mm',
            'Steel 20mm',
            'Steel 25mm',
        ];

        const timestamp = new Date();

        const records = materialTypes.map(name => ({
            name,
            created_at: timestamp,
            updated_at: timestamp,
        }));

        // First, ensure the table exists and is empty
        await queryInterface.bulkDelete('material_types', null, {});
        
        // Then insert the new records
        await queryInterface.bulkInsert('material_types', records);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('material_types', null, {});
    },
}; 