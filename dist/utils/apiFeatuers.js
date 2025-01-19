"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword
            ? {
                $or: [
                    { name: { $regex: this.queryStr.keyword, $options: "i" } },
                    { gstin: { $regex: this.queryStr.keyword, $options: "i" } },
                ],
            }
            : {};
        this.query = this.query.find(Object.assign({}, keyword));
        return this;
    }
    filter() {
        const queryCopy = Object.assign({}, this.queryStr);
        // Removing some fields for category
        const removeField = ["keyword", "page", "limit", "rowsPerPage"];
        removeField.forEach((key) => delete queryCopy[key]);
        if (queryCopy.categorie) {
            let categories = queryCopy["categorie"];
            // Ensure it's an array (handle comma-separated string)
            if (typeof categories === "string") {
                categories = categories.split(",");
            }
            // Convert each category to ObjectId
            categories = categories.map((category) => {
                if (mongoose_1.default.Types.ObjectId.isValid(category)) {
                    return new mongoose_1.default.Types.ObjectId(category);
                }
                else {
                    throw new Error(`Invalid ObjectId format: ${category}`);
                }
            });
            // Use $in to match any category from the list of ObjectIds
            this.query = this.query.find({ categorie: { $in: categories } });
            delete queryCopy["categorie"];
        }
        if (queryCopy["user.role"]) {
            this.query = this.query.find({ role: queryCopy["user.role"] });
            delete queryCopy["user.role"];
        }
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort({ creditAt: 1 });
        }
        return this;
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip).sort({ _id: -1 });
        return this;
    }
    // New method to execute the query
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query;
        });
    }
    // Public getter for the query
    getQuery() {
        return this.query;
    }
}
exports.default = ApiFeatures;
