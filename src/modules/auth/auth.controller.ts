import { Request, Response } from 'express';
import { User } from '@database/models/user.model';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '@utils/config';
import { createUser } from './auth.service';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        if (!validateEmail(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        if (!validatePassword(password)) {
            res.status(400).json({
                message: 'Password must be at least 6 characters long',
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create new user
        const user = await createUser({ name, email, password });

        // Generate JWT token
        const token = sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: '24h' },
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
        return;
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({
                message: 'Email and password are required',
            });
            return;
        }
        if (!validateEmail(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT token
        const token = sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: '24h' },
        );

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
        return;
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
