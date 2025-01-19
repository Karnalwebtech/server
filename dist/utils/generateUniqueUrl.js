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
Object.defineProperty(exports, "__esModule", { value: true });
function generateUniqueUrl(slug, model, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = slug;
        // Initial URL assignment
        // let url = slug;
        // Dynamic property name syntax fix
        let is_exist = yield model.findOne({ [name]: url });
        let counter = 1;
        // Loop to find a unique URL
        while (is_exist) {
            // Update URL with counter
            url = `${slug}-${counter}`;
            // Check if the new URL exists
            is_exist = yield model.findOne({ [name]: url });
            counter++;
        }
        // Return the unique URL
        return url;
    });
}
exports.default = generateUniqueUrl;
