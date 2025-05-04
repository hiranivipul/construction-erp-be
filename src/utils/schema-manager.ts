import { DB } from '@database/index';
import { Sequelize, Options } from 'sequelize';
import { config } from '@utils/config';

export class SchemaManager {
    private static instance: SchemaManager;
    private schemaInstances: Map<string, Sequelize> = new Map();
    private currentSchema = 'public';

    private constructor() {}

    public static getInstance(): SchemaManager {
        if (!SchemaManager.instance) {
            SchemaManager.instance = new SchemaManager();
        }
        return SchemaManager.instance;
    }

    private createSequelizeConfig(schema: string): Options {
        return {
            ...config.database,
            schema,
            port:
                typeof config.database.port === 'string'
                    ? parseInt(config.database.port)
                    : config.database.port,
        } as Options;
    }

    public async setSchema(schema: string): Promise<void> {
        try {
            // Check if schema exists
            const [result] = await DB.sequelize.query(
                `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
                { bind: [schema] },
            );

            if (!result || result.length === 0) {
                throw new Error(`Schema ${schema} does not exist`);
            }

            // Set search path
            await DB.sequelize.query(`SET search_path TO ${schema}`);

            // Create schema instance if it doesn't exist
            if (!this.schemaInstances.has(schema)) {
                const schemaInstance = new Sequelize(
                    this.createSequelizeConfig(schema),
                );
                this.schemaInstances.set(schema, schemaInstance);
            }

            this.currentSchema = schema;
        } catch (error) {
            console.error(`Error setting schema ${schema}:`, error);
            throw error;
        }
    }

    public async resetToPublic(): Promise<void> {
        try {
            await DB.sequelize.query('SET search_path TO public');
            this.currentSchema = 'public';
        } catch (error) {
            console.error('Error resetting to public schema:', error);
            throw error;
        }
    }

    public getCurrentSchema(): string {
        return this.currentSchema;
    }

    public getSchemaInstance(schema: string): Sequelize {
        if (!this.schemaInstances.has(schema)) {
            const schemaInstance = new Sequelize(
                this.createSequelizeConfig(schema),
            );
            this.schemaInstances.set(schema, schemaInstance);
        }
        return this.schemaInstances.get(schema)!;
    }

    public async createSchema(schema: string): Promise<void> {
        try {
            // Check if schema already exists
            const [result] = await DB.sequelize.query(
                `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
                { bind: [schema] },
            );

            if (result && result.length > 0) {
                throw new Error(`Schema ${schema} already exists`);
            }

            // Create schema
            await DB.sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);

            // Create schema instance
            const schemaInstance = new Sequelize(
                this.createSequelizeConfig(schema),
            );
            this.schemaInstances.set(schema, schemaInstance);

            // Set search path to new schema
            await this.setSchema(schema);
        } catch (error) {
            console.error(`Error creating schema ${schema}:`, error);
            throw error;
        }
    }
}
