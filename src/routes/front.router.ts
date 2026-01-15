import express from "express";
import FrontController from "@controllers/front.controller";

const router = express.Router();

// Route for the front page
router.get("/", FrontController.showFrontPage);

export default router;