import { Router } from "express";
import { 
    availabilityCheckController, 
    registerUserController, 
    loginUserController } from "../controllers/auth.controller";

const router = Router();

router.post('/SignUp', registerUserController);
router.post('/Login', loginUserController);
router.post('/CheckAvailability', availabilityCheckController);

export default router;