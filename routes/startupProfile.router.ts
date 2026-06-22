import {Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { CreateProfile, getProfile } from "../controllers/startupProfile.controller";
import { checkProfileOwnership } from "../middleware/startupProfile.middleware";
const router = Router();

router.post("/create", authMiddleware,CreateProfile );
router.get("/get/:userId", authMiddleware,checkProfileOwnership, getProfile);


export default router;