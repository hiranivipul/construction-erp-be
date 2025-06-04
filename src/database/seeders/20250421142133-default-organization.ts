'use strict';

import { QueryInterface, QueryTypes } from 'sequelize';
import { hash } from 'bcrypt';
import { config } from '@utils/config';
import { sequelize } from '../index';
import { UserRole } from '@/constants/roles';

/** @type {import('sequelize-cli').Seeder} */
export default {
    async up(queryInterface: QueryInterface) {
        const organization = {
            name: 'Super Admin Organization',
            code: 'AA9999',
            address: 'Super Admin Organization',
        };

        // First, ensure the table exists and is empty
        await queryInterface.bulkDelete('organizations', null, {});

        // Then insert the default organization using raw query to get the ID
        const [result] = await sequelize.query(
            `INSERT INTO organizations (name, code, address) 
             VALUES (:name, :code, :address) 
             RETURNING id`,
            {
                replacements: organization,
                type: QueryTypes.INSERT,
            },
        );

        if (!result || !result[0]?.id) {
            throw new Error('Failed to create organization');
        }

        const organizationId = result[0].id;

        console.log(organizationId);
        console.log(config.superAdmin.password);
        console.log(config.superAdmin.email);

        const superAdmin = {
            name: 'Super Admin',
            email: config.superAdmin.email,
            password: await hash(config.superAdmin.password, 10),
            role: UserRole.SUPER_ADMIN,
            organization_id: organizationId,
        };

        // Insert super admin user
        await queryInterface.bulkInsert('users', [superAdmin]);
    },

    async down(queryInterface: QueryInterface) {
        // Delete super admin user first (due to foreign key constraint)
        await queryInterface.bulkDelete('users', { role: 'super_admin' }, {});
        // Then delete the organization
        await queryInterface.bulkDelete(
            'organizations',
            { code: 'AA9999' },
            {},
        );
    },
};
