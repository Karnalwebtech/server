"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AsyncHandler {
    handle(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch((error) => {
                if (!res.headersSent) { // Check if the headers have already been sent
                    if (error instanceof Error) {
                        res.status(400).json({ error: error.message });
                    }
                    else {
                        res.status(400).json({ error: "An unknown error occurred" });
                    }
                }
            });
        };
    }
}
exports.default = new AsyncHandler();
