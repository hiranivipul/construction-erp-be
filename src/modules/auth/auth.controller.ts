import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '@utils/config';
import { createUser } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';
import {
    RegisterDto,
    LoginDto,
    AuthResponseDto,
    UserCreateResponseDto,
} from './auth.dto';
import { UserOrganizationView } from '@database/models/user-organization-view.model';
import { getOrganizationId } from '@/utils/helper';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, value } = registerSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message,
                })),
            });
            return;
        }
        const organizationId = getOrganizationId(req);
        const { email } = value as RegisterDto;

        // Check if user already exists
        const existingUser = await UserOrganizationView.findOne({
            where: { user_email: email, organization_id: organizationId },
        });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create new user with schema instance from request
        const user = await createUser(
            { ...value, organization_id: organizationId },
            req,
        );

        const response: UserCreateResponseDto = {
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };

        res.status(201).json(response);
        return;
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, value } = loginSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message,
                })),
            });
            return;
        }

        const { email, password, code } = value as LoginDto;

        // Check if user exists using schema instance from request
        const user = await UserOrganizationView.findOne({
            where: { user_email: email, organization_code: code },
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isPasswordValid = await compare(password, user.user_password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT token
        const token = sign(
            {
                id: user.user_id,
                email: user.user_email,
                role: user.user_role,
                organizationId: user.organization_id,
            },
            config.jwt.secret,
            { expiresIn: '24h' },
        );

        const response: AuthResponseDto = {
            message: 'Login successful',
            user: {
                id: user.user_id,
                name: user.user_name,
                email: user.user_email,
                role: user.user_role,
            },
            token,
        };

        res.status(200).json(response);
        return;
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
