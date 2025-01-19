import { Router } from "express";
import CacheManager from "../../../utils/comman-repositories/removeCaches";
import { authorizeRoles, isAuthenticatedUser } from "../../../middlewares/auth";
import upload from "../../../middlewares/multer";
const router = Router();
const cacheManager = new CacheManager();

// Route to remove cache
router.post("/remove-cache", upload.array("images", 0), (req, res, next) => {
  cacheManager.removeCache(req, res, next);
});

export default router;
