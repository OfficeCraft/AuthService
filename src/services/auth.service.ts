import { insertUser, getUserByEmail, getUserByUsername } from "../models/user.model";

export async function createUserService(
    username: string,
    email: string,
    password: string
) {
    const existingUser = await checkForExistingUserService(username, email);
    if (!existingUser.emailAvailable) {
        throw new Error("User with this email already exists");
    }
    if (!existingUser.usernameAvailable) {
        throw new Error("User with this username already exists");
    }
    const avtarurl = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;
    const userId = await insertUser(username, email, password, avtarurl);
    return userId;
}

export async function checkForExistingUserService(
    username?: string,
    email?: string
) {
    
    if(email) {
        var userByEmail = await getUserByEmail(email);
    }
    if(username) {
        var userByUsername = await getUserByUsername(username);
    }

    return {
        emailAvailable : !userByEmail? true : false,
        usernameAvailable : !userByUsername? true : false
    }
}