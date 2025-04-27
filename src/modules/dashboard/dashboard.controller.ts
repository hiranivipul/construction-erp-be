import { Request, Response } from 'express';
import { getProjectCount, getVendorCount } from './dashboard.service';
export const getState = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectCount = await getProjectCount();
        const vendorCount = await getVendorCount();

        const resOb = { projectCount, vendorCount };
        res.status(200).json(resOb);
        return;
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
