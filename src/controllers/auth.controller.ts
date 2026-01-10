import { Request, Response } from "express";
import { checkForExistingUserService, createUserService, LoginUserService, getUserByIdService } from "../services/auth.service";
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

export async function logoutUserController(req: Request, res: Response) {
    try {
        res.clearCookie("auth_token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to logout user", 
            message: (error as Error).message
        });
    }
}

export async function meController(req: Request, res: Response) {
    try {
        const userId = (req as any).userId; // Assuming authMiddleware has added userId to req

        console.log("Fetching details for userId:", userId);

        // Fetch user details from the database
        const user: User | null = await getUserByIdService(userId); // Implement this function in the service layer

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch user details", 
            message: (error as Error).message
        });
    }
}