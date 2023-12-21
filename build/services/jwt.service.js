"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtService {
    static async getInstance() {
        if (!JwtService.instance) {
            JwtService.instance = new JwtService();
        }
        return JwtService.instance;
    }
    sign(payload, signOptions = {}) {
        return (0, jsonwebtoken_1.sign)(payload, JwtService.secret, signOptions);
    }
    verify(token) {
        try {
            const result = (0, jsonwebtoken_1.verify)(token, JwtService.secret);
            return result;
        }
        catch (error) {
            return null;
        }
    }
}
exports.JwtService = JwtService;
JwtService.secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'keyboard_cat';
