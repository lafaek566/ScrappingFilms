import express from "express";
import {
  scrapeFilms,
  getAllFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
} from "../controllers/scrapeController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/scrape", authenticateToken, isAdmin, scrapeFilms);
router.get("/films", getAllFilms);
router.get("/films/:id", getFilmById);
router.post("/films", authenticateToken, isAdmin, createFilm); // ✅ Tambahkan ini!
router.put("/films/:id", authenticateToken, isAdmin, updateFilm);
router.delete("/films/:id", authenticateToken, isAdmin, deleteFilm);

export default router;
