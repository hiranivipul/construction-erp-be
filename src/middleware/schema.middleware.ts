import { Request, Response, NextFunction } from 'express';
import { SchemaManager } from '@utils/schema-manager';
import { verify } from 'jsonwebtoken';
import { config } from '@utils/config';

// Extend Express Request type to include schema
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            schema?: string;
            schemaInstance?: any;
        }
    }
}

export const schemaResetMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // Store the original end function
    const originalEnd = res.end;

    // Override the end function
    res.end = function (chunk?: any, encoding?: any, callback?: any) {
        // Reset schema after response is sent
        const schemaManager = SchemaManager.getInstance();
        schemaManager.resetToPublic().catch(error => {
            console.error('Error resetting schema:', error);
        });

        // Call the original end function
        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
};

interface JwtPayload {
    id: string;
    email: string;
    role: string;
    organizationId: string;
}

export const schemaMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const schemaManager = SchemaManager.getInstance();

    try {
        // Get schema from request (could be from header, query, or body)
        const schema = (req.headers['x-organization-id'] as string) || 'public';

        // Set schema in SchemaManager
        await schemaManager.setSchema(schema);

        // Attach schema and instance to request
        req.schema = schema;
        req.schemaInstance = schemaManager.getSchemaInstance(schema);

        // Add cleanup on response finish
        res.on('finish', async () => {
            try {
                await schemaManager.resetToPublic();
            } catch (error) {
                console.error('Error resetting schema:', error);
            }
        });

        next();
    } catch (error) {
        console.error('Schema middleware error:', error);
        res.status(500).json({ message: 'Error setting up schema' });
    }
};
