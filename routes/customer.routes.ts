import { Router } from "express";
import { createCustomer, getCustomers } from "../controllers/customer.controller";

const router = Router();

router.get("/getAll", getCustomers);
router.post("/save", createCustomer);

export default router;