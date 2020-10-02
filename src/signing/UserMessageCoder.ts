import { BigNumber } from "ethers";
import { AbiType, BaseCoder } from "./BaseCoder";
import { checkArgument } from "../common/preconditions";

export const FunctionId = {
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

export const functionIdToString = (functionId: number) => {
  switch (functionId) {
    case FunctionId.ADD_LIQUIDITY_ID:
      return "addLiquidity";
    case FunctionId.REMOVE_LIQUIDITY_ID:
      return "removeLiquidity";
    case FunctionId.OPEN_LONG_ID:
      return "openLong";
    case FunctionId.OPEN_SHORT_ID:
      return "openShort";
    case FunctionId.CLOSE_TRADE_ID:
      return "closeTrade";
    case FunctionId.ADD_COLLATERAL_ID:
      return "addCollateral";
    case FunctionId.LIQUIDATE_TRADE_ID:
      return "liquidateTrade";
    case FunctionId.BALANCE_POOLS_ID:
      return "balancePools";
    case FunctionId.INSTANT_WITHDRAW_ID:
      return "instantWithdraw";
    default:
      throw new Error("should not get here");
  }
};

export interface DecodedMessage {
  userAddress: string;
  message: CommonTransactionMessage;
  validationRule: any;
}

export interface OpenTradeDecode {
  message: OpenTradeMessage;
  validationRule: any;
}

export interface CloseTradeDecode {
  message: CloseTradeMessage;
  validationRule: any;
}

export interface AddCollateralDecode {
  message: AddCollateralMessage;
  validationRule: any;
}

export interface LiquidateTradeDecode {
  message: LiquidateTradeMessage;
  validationRule: any;
}

export interface ChangeLiquidityDecode {
  message: ChangeLiquidityMessage;
  validationRule: any;
}

export interface BalancePoolDecode {
  message: BalancePoolMessage;
  validationRule: any;
}

export interface InstantWithdrawDecode {
  message: InstantWithdrawMessage;
  validationRule: any;
}

const COMMON_ABI: ReadonlyArray<AbiType> = [
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

export interface CommonTransactionMessage {
  functionId: number;
  userInteractionNumber: BigNumber;
  exchangeAddress: string;
  assetPriceBound: BigNumber;
  stablePriceBound: BigNumber;
  gasStableBound: BigNumber;
  signatureTime: BigNumber;
  minTransmitterGas: BigNumber;
  specificMessage?: string;
}

const OPEN_TRADE_ABI: ReadonlyArray<AbiType> = [
  { type: "uint256", name: "collateral", validation: "required|eth_bignumber" },
  { type: "uint256", name: "leverage", validation: "required|eth_bignumber" },
  {
    type: "uint256",
    name: "tradeFeeBound",
    validation: "required|eth_bignumber"
  }
];

export interface OpenTradeMessage extends CommonTransactionMessage {
  collateral: BigNumber;
  leverage: BigNumber;
  tradeFeeBound: BigNumber;
}

const CLOSE_TRADE_ABI: ReadonlyArray<AbiType> = [
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

export interface CloseTradeMessage extends CommonTransactionMessage {
  tradeId: BigNumber;
  isLong: boolean;
  percentToClose: BigNumber;
  referral: string;
  tradeFeeBound: BigNumber;
}

// add addCollateral
const ADD_COLLATERAL_ABI: ReadonlyArray<AbiType> = [
  {
    type: "uint256",
    name: "collateral",
    validation: "required|eth_bignumber"
  },
  { type: "uint256", name: "tradeId", validation: "required|eth_bignumber" }
];

export interface AddCollateralMessage extends CommonTransactionMessage {
  tradeId: BigNumber;
  collateral: BigNumber;
}

// add liquidateTrade
const LIQUIDATE_TRADE_ABI: ReadonlyArray<AbiType> = [
  { type: "uint256", name: "tradeId", validation: "required|eth_bignumber" }
];

const INSTANT_WITHDRAW_ABI: ReadonlyArray<AbiType> = [
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

export interface InstantWithdrawMessage extends CommonTransactionMessage {
  tokenAddress: string;
  amount: BigNumber;
  registryHolder: string;
}

export interface LiquidateTradeMessage extends CommonTransactionMessage {
  tradeId: BigNumber;
}

const CHANGE_LIQUIDITY_ABI: ReadonlyArray<AbiType> = [
  { type: "uint256", name: "amount", validation: "required|eth_bignumber" }
];

export interface ChangeLiquidityMessage extends CommonTransactionMessage {
  amount: BigNumber;
}

const BALANCE_POOLS_ABI: ReadonlyArray<AbiType> = [
  { type: "uint256", name: "amount", validation: "required|eth_bignumber" },
  {
    type: "bool",
    name: "isTradingAsset",
    validation: "required|boolean"
  }
];

export interface BalancePoolMessage extends CommonTransactionMessage {
  amount: BigNumber;
  isTradingAsset: boolean;
}

export class UserMessageEncoder extends BaseCoder {
  async encodeOpenTrade(
    message: OpenTradeMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ): Promise<{ packedMessage: string; signature: string }> {
    checkArgument(
      message.functionId === FunctionId.OPEN_LONG_ID ||
        message.functionId === FunctionId.OPEN_SHORT_ID
    );

    const object = {
      ...message,
      specificMessage: this.packData(OPEN_TRADE_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }

  encodeCloseTrade(
    message: CloseTradeMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    checkArgument(message.functionId === FunctionId.CLOSE_TRADE_ID);

    const object = {
      ...message,
      specificMessage: this.packData(CLOSE_TRADE_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }

  encodeAddCollateral(
    message: AddCollateralMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    checkArgument(message.functionId === FunctionId.ADD_COLLATERAL_ID);

    const object = {
      ...message,
      specificMessage: this.packData(ADD_COLLATERAL_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }

  encodeInstantWithdraw(
    message: InstantWithdrawMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    checkArgument(message.functionId === FunctionId.INSTANT_WITHDRAW_ID);

    const object = {
      ...message,
      specificMessage: this.packData(INSTANT_WITHDRAW_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }

  encodeLiquidateTrade(
    message: LiquidateTradeMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    checkArgument(message.functionId === FunctionId.LIQUIDATE_TRADE_ID);

    const object = {
      ...message,
      specificMessage: this.packData(LIQUIDATE_TRADE_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }

  encodeChangeLiquidity(
    message: ChangeLiquidityMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    checkArgument(
      message.functionId === FunctionId.ADD_LIQUIDITY_ID ||
        message.functionId === FunctionId.REMOVE_LIQUIDITY_ID
    );

    const object = {
      ...message,
      specificMessage: this.packData(CHANGE_LIQUIDITY_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }

  encodeBalancePools(
    message: BalancePoolMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    checkArgument(message.functionId === FunctionId.BALANCE_POOLS_ID);

    const object = {
      ...message,
      specificMessage: this.packData(BALANCE_POOLS_ABI, message)
    };

    return this.encode(object, signRequest, COMMON_ABI);
  }
}

export class UserMessageDecoder extends BaseCoder {
  decodeCommonMessage(
    packedMessage: string,
    signature: string
  ): DecodedMessage {
    const { message, validationRule } = this.decode(packedMessage, COMMON_ABI);

    return {
      message,
      userAddress: this.calculateUserAddress(packedMessage, signature),
      validationRule
    };
  }

  decodeOpenTrade(packedMessage: string): OpenTradeDecode {
    return this.decode(packedMessage, OPEN_TRADE_ABI);
  }

  decodeCloseTrade(packedMessage: string): CloseTradeDecode {
    return this.decode(packedMessage, CLOSE_TRADE_ABI);
  }

  decodeAddCollateral(packedMessage: string): AddCollateralDecode {
    return this.decode(packedMessage, ADD_COLLATERAL_ABI);
  }

  decodeInstantWithdraw(packedMessage: string): InstantWithdrawDecode {
    return this.decode(packedMessage, INSTANT_WITHDRAW_ABI);
  }

  decodeLiquidateTrade(packedMessage: string): LiquidateTradeDecode {
    return this.decode(packedMessage, LIQUIDATE_TRADE_ABI);
  }

  decodeChangeLiquidity(packedMessage: string): ChangeLiquidityDecode {
    return this.decode(packedMessage, CHANGE_LIQUIDITY_ABI);
  }

  decodeBalancePools(packedMessage: string): BalancePoolDecode {
    return this.decode(packedMessage, BALANCE_POOLS_ABI);
  }
}
