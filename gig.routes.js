import express from "express";
import auth from "../middlewares/auth.js";
import {getGigs,getGig,createGig,updateGig,deleteGig,getMyGigs} from "../controllers/gig.controller.js";

const router = express.Router();

router.get("/", getGigs);
router.get("/my", auth, getMyGigs);
router.get("/:id", getGig);
router.post("/", auth, createGig);
router.put("/:id", auth, updateGig);
router.delete("/:id", auth, deleteGig);

export default router;
