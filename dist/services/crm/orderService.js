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
const orderDetailsRepository_1 = __importDefault(require("../../repositories/crm/orderDetailsRepository"));
const imageUploader = new ImageUpload_1.ImageUploader();
const add_image = new imageRepository_1.default();
const orderDetailsRepository = new orderDetailsRepository_1.default();
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    add_new(data, files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_details = JSON.parse(data.products_details);
            const order_details_data = yield orderDetailsRepository.create(product_details, next);
            // Flatten the files object into a single array
            let allFiles = [
                ...(files.invoice || []),
                ...(files.doket || []),
                ...(files.image || []),
            ];
            let image_uploader;
            let image_data;
            if (allFiles.length > 0) {
                // Use a single upload call for all files
                try {
                    image_uploader = yield imageUploader.uploadImage(allFiles, next);
                }
                catch (error) {
                    return next(new ErrorHandler_1.default("Something went wrong with the upload.", 500));
                }
                // Check if uploads were successful
                if (!image_uploader || image_uploader.length === 0) {
                    return next(new ErrorHandler_1.default("Something went wrong; images are not uploaded to the server", 404));
                }
                image_data = yield add_image.createImage(files, image_uploader, user_id, next);
                if (!image_data) {
                    return next(new ErrorHandler_1.default("Something wrong image is not added into database", 404));
                }
            }
            // // await FileManager.deleteFiles(files);
            return yield this.orderRepository.create(data, image_data, user_id, order_details_data, next);
        });
    }
    update(data, files, user_id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_details = JSON.parse(data.products_details);
            const order_details_data = yield orderDetailsRepository.create(product_details, next);
            // Flatten the files object into a single array
            let allFiles = [
                ...(files.invoice || []),
                ...(files.doket || []),
                ...(files.image || []),
            ];
            // Check if there are files to upload
            let image_uploader;
            let image_data;
            if (allFiles.length > 0) {
                // Use a single upload call for all files
                try {
                    image_uploader = yield imageUploader.uploadImage(allFiles, next);
                }
                catch (error) {
                    return next(new ErrorHandler_1.default("Something went wrong with the upload.", 500));
                }
                // Check if uploads were successful
                if (!image_uploader || image_uploader.length === 0) {
                    return next(new ErrorHandler_1.default("Something went wrong; images are not uploaded to the server", 404));
                }
                image_data = yield add_image.createImage(files, image_uploader, user_id, next);
                if (!image_data) {
                    return next(new ErrorHandler_1.default("Something wrong image is not added into database", 404));
                }
            }
            // await FileManager.deleteFiles(files);
            return yield this.orderRepository.update(data, image_data, user_id, order_details_data, next);
        });
    }
    all(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.all(query);
        });
    }
    data_counter(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.data_counter(query);
        });
    }
    // async find_by_id_and_update(id: string, data: any, next: NextFunction) {
    //   return await this.productRepository.find_by_id_and_update(id, data, next);
    // }
    find_by_id(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.find_by_id(id, next);
        });
    }
}
exports.default = OrderService;
