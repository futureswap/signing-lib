var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
define("common/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("common/preconditions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkArgument = exports.checkDefined = void 0;
    function checkDefined(val, message = 'Should not be befined') {
        if (val === null || val === undefined) {
            throw new Error(message);
        }
        return val;
    }
    exports.checkDefined = checkDefined;
    function checkArgument(expression, message = 'checkArgument') {
        if (!expression) {
            throw new Error(message);
        }
    }
    exports.checkArgument = checkArgument;
});
define("signing/BaseCoder", ["require", "exports", "ethers", "common/preconditions"], function (require, exports, ethers_1, preconditions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseCoder = void 0;
    class BaseCoder {
        decode(packedMessage, abiType) {
            const coder = new ethers_1.utils.AbiCoder();
            const abiTypeArray = this.getAbiTypes(abiType);
            const data = coder.decode(abiTypeArray, packedMessage);
            const message = this.destructureData(abiType, data);
            const validationRule = this.computeValiationRule(abiType);
            return {
                message,
                validationRule
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
            return abiArray.map(t => t.type);
        }
        createValueArray(abiArray, message) {
            const array = new Array(abiArray.length);
            for (let i = 0; i < abiArray.length; i++) {
                array[i] = preconditions_1.checkDefined(message[abiArray[i].name], abiArray[i].name);
            }
            return array;
        }
        calculateUserAddress(packedMessage, signature) {
            const hash = ethers_1.utils.keccak256(packedMessage);
            const hashBytes = ethers_1.utils.arrayify(hash);
            // TODO how are we verifying the address of the user?
            return ethers_1.utils.verifyMessage(hashBytes, signature);
            //utils.recoverPublicKey
            // return utils.recoverAddress(hashBytes, signature);
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
});
define("signing/UserMessageCoder", ["require", "exports", "signing/BaseCoder", "common/preconditions"], function (require, exports, BaseCoder_1, preconditions_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserMessageDecoder = exports.UserMessageEncoder = exports.functionIdToString = exports.FunctionId = void 0;
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
            type: "address",
            name: "registryHolder",
            validation: "required|eth_address"
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
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.OPEN_LONG_ID ||
                message.functionId === exports.FunctionId.OPEN_SHORT_ID);
            const object = {
                ...message,
                specificMessage: this.packData(OPEN_TRADE_ABI, message)
            };
            return this.encode(object, signRequest, COMMON_ABI);
        }
        encodeCloseTrade(message, signRequest) {
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.CLOSE_TRADE_ID);
            const object = {
                ...message,
                specificMessage: this.packData(CLOSE_TRADE_ABI, message)
            };
            return this.encode(object, signRequest, COMMON_ABI);
        }
        encodeAddCollateral(message, signRequest) {
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.ADD_COLLATERAL_ID);
            const object = {
                ...message,
                specificMessage: this.packData(ADD_COLLATERAL_ABI, message)
            };
            return this.encode(object, signRequest, COMMON_ABI);
        }
        encodeInstantWithdraw(message, signRequest) {
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.INSTANT_WITHDRAW_ID);
            const object = {
                ...message,
                specificMessage: this.packData(INSTANT_WITHDRAW_ABI, message)
            };
            return this.encode(object, signRequest, COMMON_ABI);
        }
        encodeLiquidateTrade(message, signRequest) {
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.LIQUIDATE_TRADE_ID);
            const object = {
                ...message,
                specificMessage: this.packData(LIQUIDATE_TRADE_ABI, message)
            };
            return this.encode(object, signRequest, COMMON_ABI);
        }
        encodeChangeLiquidity(message, signRequest) {
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.ADD_LIQUIDITY_ID ||
                message.functionId === exports.FunctionId.REMOVE_LIQUIDITY_ID);
            const object = {
                ...message,
                specificMessage: this.packData(CHANGE_LIQUIDITY_ABI, message)
            };
            return this.encode(object, signRequest, COMMON_ABI);
        }
        encodeBalancePools(message, signRequest) {
            preconditions_2.checkArgument(message.functionId === exports.FunctionId.BALANCE_POOLS_ID);
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
        decodeInstantWithdraw(packedMessage) {
            return this.decode(packedMessage, INSTANT_WITHDRAW_ABI);
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
});
define("signing/FsMessageCoder", ["require", "exports", "signing/BaseCoder"], function (require, exports, BaseCoder_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StamperMessageEncoder = exports.VerifierMessageEncoder = exports.OracleMessageEncoder = void 0;
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
    class OracleMessageEncoder extends BaseCoder_2.BaseCoder {
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
    class VerifierMessageEncoder extends BaseCoder_2.BaseCoder {
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
    class StamperMessageEncoder extends BaseCoder_2.BaseCoder {
        async encodeStamperMessage(stamperMessage, signRequest) {
            return this.encode(stamperMessage, signRequest, STAMPER_MESSAGE_ABI);
        }
    }
    exports.StamperMessageEncoder = StamperMessageEncoder;
});
define("index", ["require", "exports", "signing/UserMessageCoder", "signing/FsMessageCoder"], function (require, exports, UserMessageCoder_1, FsMessageCoder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(UserMessageCoder_1, exports);
    __exportStar(FsMessageCoder_1, exports);
});
define("common/BigNumbers", ["require", "exports", "ethers"], function (require, exports, ethers_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateToBN = exports.bI2BN = exports.bN2BI = void 0;
    exports.bN2BI = (bigNumber) => {
        return BigInt(bigNumber.toHexString());
    };
    exports.bI2BN = (bigInt) => {
        return ethers_2.BigNumber.from(bigInt);
    };
    exports.dateToBN = (date) => {
        // TODO check range of date
        return ethers_2.BigNumber.from(date.getTime());
    };
});
