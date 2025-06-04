'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create a function to generate slug from name
        await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION generate_material_slug()
      RETURNS TRIGGER AS $$
      BEGIN
        -- First trim spaces, then replace multiple spaces with single space, convert to lowercase, and generate slug
        NEW.slug := lower(
          regexp_replace(
            lower(
              regexp_replace(
                trim(NEW.name),
                '\\s+',
                ' ',
                'g'
              )
            ),
            '[^a-z0-9]+',
            '-',
            'g'
          )
        );
        
        -- Check if slug already exists within the same organization and append number if needed
        IF EXISTS (
          SELECT 1 
          FROM material_types 
          WHERE slug = NEW.slug 
          AND organization_id = NEW.organization_id 
          AND id != NEW.id
        ) THEN
          NEW.slug := NEW.slug || '-' || (
            SELECT count(*) + 1 
            FROM material_types 
            WHERE slug LIKE NEW.slug || '%'
            AND organization_id = NEW.organization_id
          );
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

        await queryInterface.createTable('material_types', {
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
            slug: {
                type: Sequelize.STRING,
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

        // Create trigger to automatically generate slug
        await queryInterface.sequelize.query(`
      CREATE TRIGGER set_material_slug
      BEFORE INSERT OR UPDATE ON material_types
      FOR EACH ROW
      EXECUTE FUNCTION generate_material_slug();
    `);

        // Add composite unique constraint for name and organization_id
        await queryInterface.addConstraint('material_types', {
            fields: ['slug', 'organization_id'],
            type: 'unique',
            name: 'material_types_slug_organization_id_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'DROP TRIGGER IF EXISTS set_material_slug ON material_types;',
        );
        await queryInterface.sequelize.query(
            'DROP FUNCTION IF EXISTS generate_material_slug();',
        );
        await queryInterface.dropTable('material_types');
    },
};
