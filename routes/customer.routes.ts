import { Router } from "express";
import { createCustomer, getCustomers } from "../controllers/customer.controller";
import { checkAlreadyHaveProfile } from "../middleware/startupProfile.middleware";

const router = Router();

router.get("/getAll", getCustomers);
router.post("/save", createCustomer);

export default router;