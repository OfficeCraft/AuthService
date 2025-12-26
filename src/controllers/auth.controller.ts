import { Request, Response } from "express";
import { checkForExistingUserService, createUserService,  } from "../services/auth.service";

export async function registerUserController(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
        const userId = await createUserService(username, email, password);
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
