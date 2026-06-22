import {Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { CreateProfile } from "../controllers/startupProfile.controller";
const router = Router();

router.post("/create", authMiddleware,CreateProfile );


export default router;