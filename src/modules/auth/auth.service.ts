import { User } from '../../database/models/user.model';
import { hash } from 'bcrypt';
import { UserRoleEnum } from '../../database/models/user.model';

interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
    const { name, email, password } = input;
    const hashedPassword = await hash(password, 10);
    return User.create({
        name,
        email,
        password: hashedPassword,
        role: UserRoleEnum.USER,
    });
};
