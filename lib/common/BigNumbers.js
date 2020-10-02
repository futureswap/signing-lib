"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToBN = exports.bI2BN = exports.bN2BI = void 0;
const ethers_1 = require("ethers");
exports.bN2BI = (bigNumber) => {
    return BigInt(bigNumber.toHexString());
};
exports.bI2BN = (bigInt) => {
    return ethers_1.BigNumber.from(bigInt);
};
exports.dateToBN = (date) => {
    // TODO check range of date
    return ethers_1.BigNumber.from(date.getTime());
};
