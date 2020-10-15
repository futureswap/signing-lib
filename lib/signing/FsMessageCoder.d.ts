import { BigNumber } from "ethers";
import { BaseCoder } from "./BaseCoder";
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
export interface InstantWithdrawOracleMessage {
    userMessage: string;
    userSignature: string;
    signatureTime: number;
}
export declare class OracleMessageEncoder extends BaseCoder {
    encodeOracleMessage(oracleMessage: UnpackedOracleMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
    encodeInstantWithdrawOracleMessage(oracleMessage: InstantWithdrawOracleMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
}
export interface UnpackedVerifierMessage {
    oracleMessage: string;
    oracleSignature: string;
}
export declare class VerifierMessageEncoder extends BaseCoder {
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
export declare class StamperMessageEncoder extends BaseCoder {
    encodeStamperMessage(stamperMessage: UnpackedStamperMessage, signRequest: (messageHashBytes: Uint8Array) => Promise<string>): Promise<{
        packedMessage: string;
        signature: string;
    }>;
}
