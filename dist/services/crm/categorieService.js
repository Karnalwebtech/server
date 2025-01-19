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
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const ImageUpload_1 = require("../../utils/ImageUpload");
const imageRepository_1 = __importDefault(require("../../utils/comman-repositories/imageRepository"));
const imageUploader = new ImageUpload_1.ImageUploader();
const add_image = new imageRepository_1.default();
class CategorieService {
    constructor(categorieRepository) {
        this.categorieRepository = categorieRepository;
    }
    add_new_category(data, files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing_name = yield this.categorieRepository.findByName(data.name);
            if (existing_name) {
                return next(new ErrorHandler_1.default("Categorie with this Name already exists", 400));
            }
            const image_uploader = yield imageUploader.uploadImage(files, next);
            if (!image_uploader) {
                return next(new ErrorHandler_1.default("Something wrong image is not uploaded to the server", 404));
            }
            const image_data = yield add_image.createImage(files, image_uploader, user_id, next);
            if (!image_data) {
                return next(new ErrorHandler_1.default("Something wrong image is not added into database", 404));
            }
            // await FileManager.deleteFiles(files);
            return yield this.categorieRepository.createCategorie(data, image_data, user_id);
        });
    }
    update(data, files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id_exist = yield this.categorieRepository.find_by_id(data.id, next);
            if (!id_exist) {
                return next(new ErrorHandler_1.default("Categorie ID does not exist", 400));
            }
            const existing_name = yield this.categorieRepository.findByName(data.name);
            if (existing_name) {
                if (existing_name && existing_name.name !== id_exist.name) {
                    return next(new ErrorHandler_1.default("Categorie with this Name already exists", 400));
                }
            }
            let image_uploader;
            let image_data;
            if (files.length > 0) {
                image_uploader = yield imageUploader.uploadImage(files, next);
                if (!image_uploader) {
                    return next(new ErrorHandler_1.default("Something wrong image is not uploaded to the server", 404));
                }
                image_data = yield add_image.createImage(files, image_uploader, user_id, next);
                if (!image_data) {
                    return next(new ErrorHandler_1.default("Something wrong image is not added into database", 404));
                }
            }
            // await FileManager.deleteFiles(files);
            return yield this.categorieRepository.update(data, image_data, user_id);
        });
    }
    all_categorie(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categorieRepository.all_categorie(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categorieRepository.data_counter(query);
        });
    }
    find_by_id_and_update(id, data, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categorieRepository.find_by_id_and_update(id, data, next);
        });
    }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categorieRepository.find_by_id(id, next);
        });
    }
}
exports.default = CategorieService;
