import { Request, Response, NextFunction } from 'express';
import settings from '../config/settings';

export const internalAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers['x-internal-token'];
    
    if (!token || token !== settings.INTERNAL_TOKEN) {
        return res.status(401).json({ 
            error: 'Unauthorized', 
            code: 'INVALID_INTERNAL_TOKEN' 
        });
    }
    
    next();
};