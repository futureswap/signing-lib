"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInteractionNumberRandom = void 0;
const ethers_1 = require("ethers");
exports.userInteractionNumberRandom = () => {
    return ethers_1.utils.hexStripZeros(ethers_1.utils.hexlify(ethers_1.utils.randomBytes(31)) + "01");
};
