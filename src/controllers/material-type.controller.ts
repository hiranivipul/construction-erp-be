import { Request, Response } from 'express';
import { MaterialType } from '../database/models/material-type.model';
import { sequelize } from '../database';

export class MaterialTypeController {
    public async create(req: Request, res: Response): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const { name, description } = req.body;

            // Check if material type with same name already exists
            const existingMaterialType = await MaterialType.findOne({
                where: { name },
                transaction,
            });

            if (existingMaterialType) {
                await transaction.rollback();
                res.status(400).json({
                    success: false,
                    message: 'Material type with this name already exists',
                });
                return;
            }

            const materialType = await MaterialType.create(
                {
                    name,
                    description,
                },
                { transaction },
            );

            await transaction.commit();
            res.status(201).json({
                success: true,
                data: materialType,
            });
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const materialTypes = await MaterialType.findAll();
            res.status(200).json({
                success: true,
                data: materialTypes,
            });
        } catch (error) {
            console.error('Error fetching material types:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch material types',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const materialType = await MaterialType.findByPk(id);

            if (!materialType) {
                res.status(404).json({
                    success: false,
                    message: 'Material type not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: materialType,
            });
        } catch (error) {
            console.error('Error fetching material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const materialType = await MaterialType.findByPk(id, { transaction });

            if (!materialType) {
                await transaction.rollback();
                res.status(404).json({
                    success: false,
                    message: 'Material type not found',
                });
                return;
            }

            // Check if new name already exists (excluding current record)
            if (name && name !== materialType.name) {
                const existingMaterialType = await MaterialType.findOne({
                    where: { name },
                    transaction,
                });

                if (existingMaterialType) {
                    await transaction.rollback();
                    res.status(400).json({
                        success: false,
                        message: 'Material type with this name already exists',
                    });
                    return;
                }
            }

            await materialType.update(
                {
                    name,
                    description,
                },
                { transaction },
            );

            await transaction.commit();
            res.status(200).json({
                success: true,
                data: materialType,
            });
        } catch (error) {
            await transaction.rollback();
            console.error('Error updating material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const materialType = await MaterialType.findByPk(id, { transaction });

            if (!materialType) {
                await transaction.rollback();
                res.status(404).json({
                    success: false,
                    message: 'Material type not found',
                });
                return;
            }

            await materialType.destroy({ transaction });
            await transaction.commit();

            res.status(200).json({
                success: true,
                message: 'Material type deleted successfully',
            });
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
} 