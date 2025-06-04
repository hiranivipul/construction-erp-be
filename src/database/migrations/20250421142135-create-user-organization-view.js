'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE OR REPLACE VIEW user_organization_view AS
            SELECT 
                u.id as user_id,
                u.name as user_name,
                u.email as user_email,
                u.password as user_password,
                u.avatar as user_avatar,
                u.role as user_role,
                u.created_at as user_created_at,
                u.updated_at as user_updated_at,
                o.id as organization_id,
                o.name as organization_name,
                o.code as organization_code
            FROM users u
            INNER JOIN organizations o ON u.organization_id = o.id
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP VIEW IF EXISTS user_organization_view
        `);
    },
};
