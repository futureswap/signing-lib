declare module '@fs-labs/signing-lib/common/BigNumbers' {
  import { BigNumber } from 'ethers';
  export const bN2BI: (bigNumber: BigNumber) => bigint;
  export const bI2BN: (bigInt: BigInt) => BigNumber;
  export const dateToBN: (date: Date) => BigNumber;

}
declare module '@fs-labs/signing-lib/common/preconditions' {
  export function checkDefined<T>(val: T | null | undefined, message?: string): T;
  export function checkArgument(expression: boolean, message?: string): void;

}
declare module '@fs-labs/signing-lib/common/types' {
  export interface LooseObject {
      [key: string]: any;
  }

}
declare module '@fs-labs/signing-lib/index' {
  export * from "@fs-labs/signing-lib/signing/UserMessageCoder";
  export * from "@fs-labs/signing-lib/signing/FsMessageCoder";

}
declare module '@fs-labs/signing-lib/signing/BaseCoder' {
  import { LooseObject } from "@fs-labs/signing-lib/common/types";
  export interface AbiType {
      readonly type: string;
      readonly name: string;
      readonly validation: string;
  }
  export class BaseCoder {
      protected decode(packedMessage: string, abiType: ReadonlyArray<AbiType>): {
          message: any;
          validationRule: LooseObject;
      };
      protected destructureData(abiArray: ReadonlyArray<AbiType>, data: ReadonlyArray<any>): any;
      protected encode(message: LooseObject, signRequest: (messageHashBytes: Uint8Array) => Promise<string>, abiType: ReadonlyArray<AbiType>): Promise<{
          packedMessage: string;
          signature: string;
      }>;
      protected packData(abiArray: ReadonlyArray<AbiType>, message: LooseObject): string;
      protected getAbiTypes(abiArray: ReadonlyArray<AbiType>): string[];
      protected createValueArray(abiArray: ReadonlyArray<AbiType>, message: LooseObject): any[];
      protected calculateUserAddress(packedMessage: string, signature: string): string;
      protected computeValiationRule(abiArray: ReadonlyArray<AbiType>): LooseObject;
  }

}
declare module '@fs-labs/signing-lib/signing/FsMessageCoder' {
  import { BigNumber } from "ethers";
  import { BaseCoder } from "@fs-labs/signing-lib/signing/BaseCoder";
  export interface UnpackedOracleMessage {
      assetPrice: BigNumber;
      marketAssetPrice: BigNumber;
      stablePrice: BigNumber;
      gasStable: BigNumber;
      signatureTime: number;
      userMessage: string;
      userSignature: string;
      tradeFeeStable: string;
  }
  export class OracleMessageEncoder extends BaseCoder {
      encodeOracleMessage(oracleMessage: UnpackedOracleMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
          packedMessage: string;
          signature: string;
      }>;
  }
  export interface UnpackedVerifierMessage {
      oracleMessage: string;
      oracleSignature: string;
  }
  export class VerifierMessageEncoder extends BaseCoder {
      encodeVerifierMessage(verifierMessage: UnpackedVerifierMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
          packedMessage: string;
          signature: string;
      }>;
  }
  export interface UnpackedStamperMessage {
      verifierMessage: string;
      verifierSignature: string;
      transmitterAddress: string;
  }
  export class StamperMessageEncoder extends BaseCoder {
      encodeStamperMessage(stamperMessage: UnpackedStamperMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
          packedMessage: string;
          signature: string;
      }>;
  }

}
declare module '@fs-labs/signing-lib/signing/UserMessageCoder' {
  import { BigNumber } from "ethers";
  import { BaseCoder } from "@fs-labs/signing-lib/signing/BaseCoder";
  export const FunctionId: {
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
  export const functionIdToString: (functionId: number) => "addLiquidity" | "removeLiquidity" | "openLong" | "openShort" | "closeTrade" | "addCollateral" | "liquidateTrade" | "balancePools" | "instantWithdraw";
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
  export class UserMessageEncoder extends BaseCoder {
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
  export class UserMessageDecoder extends BaseCoder {
      decodeCommonMessage(packedMessage: string, signature: string): DecodedMessage;
      decodeOpenTrade(packedMessage: string): OpenTradeDecode;
      decodeCloseTrade(packedMessage: string): CloseTradeDecode;
      decodeAddCollateral(packedMessage: string): AddCollateralDecode;
      decodeInstantWithdraw(packedMessage: string): InstantWithdrawDecode;
      decodeLiquidateTrade(packedMessage: string): LiquidateTradeDecode;
      decodeChangeLiquidity(packedMessage: string): ChangeLiquidityDecode;
      decodeBalancePools(packedMessage: string): BalancePoolDecode;
  }

}
declare module '@fs-labs/signing-lib' {
  import main = require('@fs-labs/signing-lib/index');
  export = main;
}