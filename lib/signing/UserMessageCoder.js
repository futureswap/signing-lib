"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageDecoder = exports.UserMessageEncoder = exports.functionIdToString = exports.FunctionId = void 0;
const BaseCoder_1 = require("./BaseCoder");
const preconditions_1 = require("../common/preconditions");
exports.FunctionId = {
    ADD_LIQUIDITY_ID: 1,
    REMOVE_LIQUIDITY_ID: 2,
    OPEN_LONG_ID: 3,
    OPEN_SHORT_ID: 4,
    CLOSE_TRADE_ID: 5,
    ADD_COLLATERAL_ID: 6,
    LIQUIDATE_TRADE_ID: 7,
    BALANCE_POOLS_ID: 8,
    INSTANT_WITHDRAW_ID: 9
};
exports.functionIdToString = (functionId) => {
    switch (functionId) {
        case exports.FunctionId.ADD_LIQUIDITY_ID:
            return "addLiquidity";
        case exports.FunctionId.REMOVE_LIQUIDITY_ID:
            return "removeLiquidity";
        case exports.FunctionId.OPEN_LONG_ID:
            return "openLong";
        case exports.FunctionId.OPEN_SHORT_ID:
            return "openShort";
        case exports.FunctionId.CLOSE_TRADE_ID:
            return "closeTrade";
        case exports.FunctionId.ADD_COLLATERAL_ID:
            return "addCollateral";
        case exports.FunctionId.LIQUIDATE_TRADE_ID:
            return "liquidateTrade";
        case exports.FunctionId.BALANCE_POOLS_ID:
            return "balancePools";
        case exports.FunctionId.INSTANT_WITHDRAW_ID:
            return "instantWithdraw";
        default:
            throw new Error("should not get here");
    }
};
const COMMON_ABI = [
    {
        type: "uint256",
        name: "assetPriceBound",
        validation: "required|eth_bignumber"
    },
    {
        type: "uint256",
        name: "stablePriceBound",
        validation: "required|eth_bignumber"
    },
    {
        type: "uint256",
        name: "gasStableBound",
        validation: "required|eth_bignumber"
    },
    {
        type: "uint256",
        name: "signatureTime",
        validation: "required|eth_bignumber"
    },
    {
        type: "uint8",
        name: "functionId",
        validation: "required|fs_functionId"
    },
    {
        type: "uint256",
        name: "userInteractionNumber",
        validation: "required|eth_bignumber"
    },
    {
        type: "address",
        name: "exchangeAddress",
        validation: "required|eth_address"
    },
    {
        type: "uint256",
        name: "minTransmitterGas",
        validation: "required|eth_bignumber"
    },
    {
        type: "bytes",
        name: "specificMessage",
        validation: "required|string|maxLength:1000"
    }
];
const OPEN_TRADE_ABI = [
    { type: "uint256", name: "collateral", validation: "required|eth_bignumber" },
    { type: "uint256", name: "leverage", validation: "required|eth_bignumber" },
    {
        type: "uint256",
        name: "tradeFeeBound",
        validation: "required|eth_bignumber"
    }
];
const CLOSE_TRADE_ABI = [
    { type: "uint256", name: "tradeId", validation: "required|eth_bignumber" },
    {
        type: "bool",
        name: "isLong",
        validation: "required|boolean"
    },
    {
        type: "uint256",
        name: "percentToClose",
        validation: "required|eth_bignumber"
    },
    {
        type: "address",
        name: "referral",
        validation: "required|eth_address"
    },
    {
        type: "uint256",
        name: "tradeFeeBound",
        validation: "required|eth_bignumber"
    }
];
// add addCollateral
const ADD_COLLATERAL_ABI = [
    {
        type: "uint256",
        name: "collateral",
        validation: "required|eth_bignumber"
    },
    { type: "uint256", name: "tradeId", validation: "required|eth_bignumber" }
];
// add liquidateTrade
const LIQUIDATE_TRADE_ABI = [
    { type: "uint256", name: "tradeId", validation: "required|eth_bignumber" }
];
const INSTANT_WITHDRAW_ABI = [
    {
        type: "address",
        name: "tokenAddress",
        validation: "required|eth_address"
    },
    {
        type: "uint256",
        name: "amount",
        validation: "required|eth_bignumber"
    },
    {
        type: "uint256",
        name: "userInteractionNumber",
        validation: "required|eth_bignumber"
    },
    {
        type: "address",
        name: "registryHolder",
        validation: "required|eth_address"
    },
    {
        type: "uint256",
        name: "minTransmitterGas",
        validation: "required|eth_bignumber"
    }
];
const CHANGE_LIQUIDITY_ABI = [
    { type: "uint256", name: "amount", validation: "required|eth_bignumber" }
];
const BALANCE_POOLS_ABI = [
    { type: "uint256", name: "amount", validation: "required|eth_bignumber" },
    {
        type: "bool",
        name: "isTradingAsset",
        validation: "required|boolean"
    }
];
class UserMessageEncoder extends BaseCoder_1.BaseCoder {
    async encodeOpenTrade(message, signRequest) {
        preconditions_1.checkArgument(message.functionId === exports.FunctionId.OPEN_LONG_ID ||
            message.functionId === exports.FunctionId.OPEN_SHORT_ID);
        const object = {
            ...message,
            specificMessage: this.packData(OPEN_TRADE_ABI, message)
        };
        return this.encode(object, signRequest, COMMON_ABI);
    }
    encodeCloseTrade(message, signRequest) {
        preconditions_1.checkArgument(message.functionId === exports.FunctionId.CLOSE_TRADE_ID);
        const object = {
            ...message,
            specificMessage: this.packData(CLOSE_TRADE_ABI, message)
        };
        return this.encode(object, signRequest, COMMON_ABI);
    }
    encodeAddCollateral(message, signRequest) {
        preconditions_1.checkArgument(message.functionId === exports.FunctionId.ADD_COLLATERAL_ID);
        const object = {
            ...message,
            specificMessage: this.packData(ADD_COLLATERAL_ABI, message)
        };
        return this.encode(object, signRequest, COMMON_ABI);
    }
    encodeInstantWithdraw(message, signRequest) {
        return this.encode(message, signRequest, INSTANT_WITHDRAW_ABI);
    }
    encodeLiquidateTrade(message, signRequest) {
        preconditions_1.checkArgument(message.functionId === exports.FunctionId.LIQUIDATE_TRADE_ID);
        const object = {
            ...message,
            specificMessage: this.packData(LIQUIDATE_TRADE_ABI, message)
        };
        return this.encode(object, signRequest, COMMON_ABI);
    }
    encodeChangeLiquidity(message, signRequest) {
        preconditions_1.checkArgument(message.functionId === exports.FunctionId.ADD_LIQUIDITY_ID ||
            message.functionId === exports.FunctionId.REMOVE_LIQUIDITY_ID);
        const object = {
            ...message,
            specificMessage: this.packData(CHANGE_LIQUIDITY_ABI, message)
        };
        return this.encode(object, signRequest, COMMON_ABI);
    }
    encodeBalancePools(message, signRequest) {
        preconditions_1.checkArgument(message.functionId === exports.FunctionId.BALANCE_POOLS_ID);
        const object = {
            ...message,
            specificMessage: this.packData(BALANCE_POOLS_ABI, message)
        };
        return this.encode(object, signRequest, COMMON_ABI);
    }
}
exports.UserMessageEncoder = UserMessageEncoder;
class UserMessageDecoder extends BaseCoder_1.BaseCoder {
    decodeCommonMessage(packedMessage, signature) {
        const { message, validationRule } = this.decode(packedMessage, COMMON_ABI);
        return {
            message,
            userAddress: this.calculateUserAddress(packedMessage, signature),
            validationRule
        };
    }
    decodeOpenTrade(packedMessage) {
        return this.decode(packedMessage, OPEN_TRADE_ABI);
    }
    decodeCloseTrade(packedMessage) {
        return this.decode(packedMessage, CLOSE_TRADE_ABI);
    }
    decodeAddCollateral(packedMessage) {
        return this.decode(packedMessage, ADD_COLLATERAL_ABI);
    }
    decodeInstantWithdraw(packedMessage, signature) {
        const decode = this.decode(packedMessage, INSTANT_WITHDRAW_ABI);
        return {
            ...decode,
            userAddress: this.calculateUserAddress(packedMessage, signature)
        };
    }
    decodeLiquidateTrade(packedMessage) {
        return this.decode(packedMessage, LIQUIDATE_TRADE_ABI);
    }
    decodeChangeLiquidity(packedMessage) {
        return this.decode(packedMessage, CHANGE_LIQUIDITY_ABI);
    }
    decodeBalancePools(packedMessage) {
        return this.decode(packedMessage, BALANCE_POOLS_ABI);
    }
}
exports.UserMessageDecoder = UserMessageDecoder;
