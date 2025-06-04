import { User } from '@database/models/user.model';
import { hash } from 'bcrypt';
import { RegisterDto } from './auth.dto';
import { Request } from 'express';

export const createUser = async (input: RegisterDto, req: Request) => {
    const { name, email, password, role, organization_id } = input;
    const hashedPassword = await hash(password, 10);

    // Use schema instance from request
    return User.create({
        name,
        email,
        password: hashedPassword,
        organization_id: organization_id,
        role: role,
    });
};
