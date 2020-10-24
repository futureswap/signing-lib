"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCoder = void 0;
const ethers_1 = require("ethers");
const preconditions_1 = require("../common/preconditions");
class BaseCoder {
    decode(packedMessage, abiType) {
        const coder = new ethers_1.utils.AbiCoder();
        const abiTypeArray = this.getAbiTypes(abiType);
        const data = coder.decode(abiTypeArray, packedMessage);
        const message = this.destructureData(abiType, data);
        const validationRule = this.computeValiationRule(abiType);
        return {
            message,
            validationRule,
        };
    }
    destructureData(abiArray, data) {
        const message = {};
        for (let i = 0; i < abiArray.length; i++) {
            message[abiArray[i].name] = data[i];
        }
        return message;
    }
    async encode(message, signRequest, abiType) {
        const packedMessage = this.packData(abiType, message);
        const messageHash = ethers_1.utils.keccak256(packedMessage);
        const messageArray = ethers_1.utils.arrayify(messageHash);
        const signature = await signRequest(messageArray);
        return { packedMessage, signature };
    }
    packData(abiArray, message) {
        const abiTypes = this.getAbiTypes(abiArray);
        const valueArray = this.createValueArray(abiArray, message);
        const coder = new ethers_1.utils.AbiCoder();
        return coder.encode(abiTypes, valueArray);
    }
    getAbiTypes(abiArray) {
        return abiArray.map((t) => t.type);
    }
    createValueArray(abiArray, message) {
        const array = new Array(abiArray.length);
        for (let i = 0; i < abiArray.length; i++) {
            array[i] = preconditions_1.checkDefined(message[abiArray[i].name], abiArray[i].name);
        }
        return array;
    }
    computeValiationRule(abiArray) {
        const valiationRule = {};
        for (let i = 0; i < abiArray.length; i++) {
            valiationRule[abiArray[i].name] = abiArray[i].validation;
        }
        return valiationRule;
    }
}
exports.BaseCoder = BaseCoder;
