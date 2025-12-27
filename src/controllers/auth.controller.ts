import { Request, Response } from "express";
import { checkForExistingUserService, createUserService, LoginUserService } from "../services/auth.service";
import { generateTokenAndsetCookie } from "../utils/tokenManager";
import { User } from "../models/user.types";

export async function registerUserController(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }

    try {  
        const userId = await createUserService(username, email, password);

        const { token, cookieOptions } = generateTokenAndsetCookie(userId);

        res.cookie("auth_token", token, cookieOptions);

        res.status(201).json({ 
            userId,
            message: "User registered successfully"
         });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to register user", 
            message: (error as Error).message
        });
    }
}

export async function availabilityCheckController(req: Request, res: Response) {
    const { username, email } = req.body;
    try {
        const existingUser = await checkForExistingUserService(username, email);
        res.status(200).json({ 
            emailAvailable: existingUser.emailAvailable,
            usernameAvailable: existingUser.usernameAvailable
         });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to check availability", 
            message: (error as Error).message
        });
    }
}


export async function loginUserController(req: Request, res: Response) {
    // Implementation for user login
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    
    try {
        // Here you would typically verify the username and password
        const userId = await LoginUserService(username, password); // Implement this function in the service layer

        const { token, cookieOptions } = await generateTokenAndsetCookie(userId);

        res.cookie("auth_token", token, cookieOptions);

        res.status(200).json({ 
            userId,
            message: "User logged in successfully"
         });


    } catch (error) {
        res.status(500).json({ 
            error: "Failed to login user", 
            message: (error as Error).message
        });
    }

}