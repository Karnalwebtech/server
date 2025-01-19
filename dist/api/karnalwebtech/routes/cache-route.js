"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const removeCaches_1 = __importDefault(require("../../../utils/comman-repositories/removeCaches"));
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const router = (0, express_1.Router)();
const cacheManager = new removeCaches_1.default();
// Route to remove cache
router.post("/remove-cache", multer_1.default.array("images", 0), (req, res, next) => {
    cacheManager.removeCache(req, res, next);
});
exports.default = router;
