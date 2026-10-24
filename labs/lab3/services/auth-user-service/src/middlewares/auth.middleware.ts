import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import settings from '../config/settings';

interface JwtPayloadWithUser extends JwtPayload {
    user: any;
}

export interface RequestWithUser extends Request {
    user: any;
}

const authMiddleware = (
    request: RequestWithUser,
    response: Response,
    next: NextFunction,
) => {
    const { headers } = request;
    const { authorization } = headers;

    if (!authorization) {
        return response
            .status(401)
            .json({ message: 'Unauthorized: no token provided' });
    }

    try {
        const [, accessToken] = authorization.split(' ');

        if (!accessToken) {
            return response
                .status(401)
                .json({ message: 'Unauthorized: no token provided' });
        }

        const { user }: JwtPayloadWithUser = jwt.verify(
            accessToken,
            settings.JWT_SECRET_KEY,
        ) as JwtPayloadWithUser;

        request.user = user;

        next();
    } catch (error) {
        console.error(error);

        return response
            .status(403)
            .json({ message: 'Forbidden: token is invalid or expired' });
    }
};

export default authMiddleware;