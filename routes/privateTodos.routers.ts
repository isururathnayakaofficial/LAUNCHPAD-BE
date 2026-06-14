import { Router } from "express";
import{ createPrivateTodo, getPrivateTodos } from "../controllers/privateTodo.controller";

const router = Router();

router.get("/getAll", getPrivateTodos);
router.post("/save", createPrivateTodo);

export default router;