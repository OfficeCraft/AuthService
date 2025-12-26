import { Router } from "express";
import { availabilityCheckController, registerUserController } from "../controllers/auth.controller";

const router = Router();

router.post('/SignUp', registerUserController);
router.post('/CheckAvailability', availabilityCheckController);

export default router;