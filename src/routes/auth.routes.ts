import { Router } from "express";
import { 
    availabilityCheckController, 
    registerUserController, 
    loginUserController, 
    logoutUserController,
    meController} from "../controllers/auth.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post('/sign-up', registerUserController);
router.post('/login', loginUserController);
router.get('/logout', authMiddleware, logoutUserController);
router.post('/check-availability', availabilityCheckController);
router.get('/me', authMiddleware, meController);

export default router;