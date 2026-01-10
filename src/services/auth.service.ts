import { insertUser, getUserByEmail, getUserByUsername, getUserById } from "../models/user.model";
import { User } from "../models/user.types";
import { hashPassword, comparePassword } from "../utils/hasher";

export async function createUserService(
    username: string,
    email: string,
    password: string
): Promise<string> {
    const existingUser = await checkForExistingUserService(username, email);
    if (!existingUser.emailAvailable) {
        throw new Error("User with this email already exists");
    }
    if (!existingUser.usernameAvailable) {
        throw new Error("User with this username already exists");
    }
    const avtarurl = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;
    const passwordHash = await hashPassword(password);
    const userId = await insertUser(username, email, passwordHash, avtarurl);
    return userId;
}

export async function checkForExistingUserService(
    username?: string,
    email?: string
) {
    
    var userByEmail: User | null = null;
    var userByUsername: User | null = null;

    if(email){
        userByEmail = await getUserByEmail(email);
    }
    if(username){
        userByUsername = await getUserByUsername(username);
    }
    return {
        emailAvailable : userByEmail == null,
        usernameAvailable : userByUsername == null
    }
}

export async function LoginUserService(username: string, password: string) {
    // Implementation for user login service and return user ID
    const user: User | null = await getUserByUsername(username);

    if (!user) {
        throw new Error("Invalid username");
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
        throw new Error("Invalid password");
    }

    return user.id;
}

export async function getUserByIdService(userId: string): Promise<User | null> {
    const user: User | null = await getUserById(userId);
    return user;
}