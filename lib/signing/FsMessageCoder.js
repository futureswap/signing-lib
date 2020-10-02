"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StamperMessageEncoder = exports.VerifierMessageEncoder = exports.OracleMessageEncoder = void 0;
const BaseCoder_1 = require("./BaseCoder");
const ORACLE_MESSAGE_ABI = [
    {
        type: "bytes",
        name: "userMessage",
        validation: "Not needed"
    },
    {
        type: "bytes",
        name: "userSignature",
        validation: "Not needed"
    },
    { type: "uint256", name: "signatureTime", validation: "Not needed" },
    {
        type: "uint256",
        name: "assetPrice",
        validation: "Not needed"
    },
    { type: "uint256", name: "stablePrice", validation: "Not needed" },
    {
        type: "uint256",
        name: "gasStable",
        validation: "Not needed"
    },
    {
        type: "uint256",
        name: "marketAssetPrice",
        validation: "Not needed"
    },
    {
        type: "uint256",
        name: "tradeFeeStable",
        validation: "Not needed"
    }
];
class OracleMessageEncoder extends BaseCoder_1.BaseCoder {
    async encodeOracleMessage(oracleMessage, signRequest) {
        return this.encode(oracleMessage, signRequest, ORACLE_MESSAGE_ABI);
    }
}
exports.OracleMessageEncoder = OracleMessageEncoder;
const VERIFIER_MESSAGE_ABI = [
    {
        type: "bytes",
        name: "oracleMessage",
        validation: "Not needed"
    },
    {
        type: "bytes",
        name: "oracleSignature",
        validation: "Not needed"
    }
];
class VerifierMessageEncoder extends BaseCoder_1.BaseCoder {
    async encodeVerifierMessage(verifierMessage, signRequest) {
        return this.encode(verifierMessage, signRequest, VERIFIER_MESSAGE_ABI);
    }
}
exports.VerifierMessageEncoder = VerifierMessageEncoder;
const STAMPER_MESSAGE_ABI = [
    {
        type: "bytes",
        name: "verifierMessage",
        validation: "Not needed"
    },
    {
        type: "bytes",
        name: "verifierSignature",
        validation: "Not needed"
    },
    {
        type: "address",
        name: "transmitterAddress",
        validation: "Not needed"
    }
];
class StamperMessageEncoder extends BaseCoder_1.BaseCoder {
    async encodeStamperMessage(stamperMessage, signRequest) {
        return this.encode(stamperMessage, signRequest, STAMPER_MESSAGE_ABI);
    }
}
exports.StamperMessageEncoder = StamperMessageEncoder;
