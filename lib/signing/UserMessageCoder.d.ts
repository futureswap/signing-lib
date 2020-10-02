import { BigNumber } from "ethers";
import { BaseCoder } from "./BaseCoder";
export declare const FunctionId: {
    ADD_LIQUIDITY_ID: number;
    REMOVE_LIQUIDITY_ID: number;
    OPEN_LONG_ID: number;
    OPEN_SHORT_ID: number;
    CLOSE_TRADE_ID: number;
    ADD_COLLATERAL_ID: number;
    LIQUIDATE_TRADE_ID: number;
    BALANCE_POOLS_ID: number;
    INSTANT_WITHDRAW_ID: number;
};
export declare const functionIdToString: (functionId: number) => "addLiquidity" | "removeLiquidity" | "openLong" | "openShort" | "closeTrade" | "addCollateral" | "liquidateTrade" | "balancePools" | "instantWithdraw";
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
export interface OpenTradeMessage extends CommonTransactionMessage {
    collateral: BigNumber;
    leverage: BigNumber;
    tradeFeeBound: BigNumber;
}
export interface CloseTradeMessage extends CommonTransactionMessage {
    tradeId: BigNumber;
    isLong: boolean;
    percentToClose: BigNumber;
    referral: string;
    tradeFeeBound: BigNumber;
}
export interface AddCollateralMessage extends CommonTransactionMessage {
    tradeId: BigNumber;
    collateral: BigNumber;
}
export interface InstantWithdrawMessage extends CommonTransactionMessage {
    tokenAddress: string;
    amount: BigNumber;
    registryHolder: string;
}
export interface LiquidateTradeMessage extends CommonTransactionMessage {
    tradeId: BigNumber;
}
export interface ChangeLiquidityMessage extends CommonTransactionMessage {
    amount: BigNumber;
}
export interface BalancePoolMessage extends CommonTransactionMessage {
    amount: BigNumber;
    isTradingAsset: boolean;
}
export declare class UserMessageEncoder extends BaseCoder {
    encodeOpenTrade(message: OpenTradeMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeCloseTrade(message: CloseTradeMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeAddCollateral(message: AddCollateralMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeInstantWithdraw(message: InstantWithdrawMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeLiquidateTrade(message: LiquidateTradeMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeChangeLiquidity(message: ChangeLiquidityMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeBalancePools(message: BalancePoolMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
}
export declare class UserMessageDecoder extends BaseCoder {
    decodeCommonMessage(packedMessage: string, signature: string): DecodedMessage;
    decodeOpenTrade(packedMessage: string): OpenTradeDecode;
    decodeCloseTrade(packedMessage: string): CloseTradeDecode;
    decodeAddCollateral(packedMessage: string): AddCollateralDecode;
    decodeInstantWithdraw(packedMessage: string): InstantWithdrawDecode;
    decodeLiquidateTrade(packedMessage: string): LiquidateTradeDecode;
    decodeChangeLiquidity(packedMessage: string): ChangeLiquidityDecode;
    decodeBalancePools(packedMessage: string): BalancePoolDecode;
}
