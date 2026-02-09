import express from "express";
import { createBooking } from "../bookingController.js";

const router = express.Router();

router.post("/", createBooking);

export default router;
