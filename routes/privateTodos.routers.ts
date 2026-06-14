import { Router } from "express";
import{ createPrivateTodo } from "../controllers/privateTodos.controller";

const router = Router();

//router.get("/getAll", getPrivateTodos);
router.post("/save", createPrivateTodo);

export default router;