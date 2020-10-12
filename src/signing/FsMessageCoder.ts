import { BigNumber } from "ethers";
import { AbiType, BaseCoder } from "./BaseCoder";

const ORACLE_MESSAGE_ABI: ReadonlyArray<AbiType> = [
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

const ORACLE_INSTANT_WITHDRAW_ABI: ReadonlyArray<AbiType> = [
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
  { type: "uint256", name: "signatureTime", validation: "Not needed" }
];

export class OracleMessageEncoder extends BaseCoder {
  async encodeOracleMessage(
    oracleMessage: UnpackedOracleMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    return this.encode(oracleMessage, signRequest, ORACLE_MESSAGE_ABI);
  }

  async encodeInstantWithdrawOracleMessage(
    oracleMessage: InstantWithdrawOracleMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    return this.encode(oracleMessage, signRequest, ORACLE_INSTANT_WITHDRAW_ABI);
  }
}

const VERIFIER_MESSAGE_ABI: ReadonlyArray<AbiType> = [
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

export interface UnpackedVerifierMessage {
  oracleMessage: string;
  oracleSignature: string;
}

export class VerifierMessageEncoder extends BaseCoder {
  async encodeVerifierMessage(
    verifierMessage: UnpackedVerifierMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    return this.encode(verifierMessage, signRequest, VERIFIER_MESSAGE_ABI);
  }
}

const STAMPER_MESSAGE_ABI: ReadonlyArray<AbiType> = [
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

export interface UnpackedStamperMessage {
  verifierMessage: string;
  verifierSignature: string;
  transmitterAddress: string;
}

export class StamperMessageEncoder extends BaseCoder {
  async encodeStamperMessage(
    stamperMessage: UnpackedStamperMessage,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>
  ) {
    return this.encode(stamperMessage, signRequest, STAMPER_MESSAGE_ABI);
  }
}
