import {Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { CreateProfile, getProfile } from "../controllers/startupProfile.controller";
import { checkAlreadyHaveProfile, checkProfileOwnership } from "../middleware/startupProfile.middleware";
const router = Router();

router.post("/create", authMiddleware,checkAlreadyHaveProfile, CreateProfile );
router.get("/get/:userId", authMiddleware,checkProfileOwnership, getProfile);


export default router;