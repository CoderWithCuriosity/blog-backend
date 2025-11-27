import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
    user?: User | null
}

interface JwtPayload {
    id: number;
    role: string;
    iat?: number;
    exp?: number;
}


export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const bearer = req.headers.authorization;

        if (!bearer || !bearer.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized" });

        const token = bearer.split(" ")[1];

        if (!token) return res.status(401).json({ message: 'Not authorized' })

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

