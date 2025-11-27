import e, { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.json({ message: 'Name, Email and Password Required' })
        }
        const { name, email, password } = req.body;
        const salt: number = 10;

        const exists = await User.findOne({ where: { email } });
        if (exists) return res.json({ message: 'User Already Exists' });
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashed });
        res.json({
            user,
            token: generateToken(user.id, user.role)
        });
    } catch (err) {
        res.status(404).json({
            message: "Invalid Endpoint"
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {

        if (!req.body) {
            return res.json({ message: 'Name, Email and Password Required' })
        }
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: "Incorrect password" });

        res.json({
            user,
            token: generateToken(user.id, user.password)
        });
    } catch (err) {
        res.status(404).json({
            message: "Invalid Endpoint"
        })
    }
}