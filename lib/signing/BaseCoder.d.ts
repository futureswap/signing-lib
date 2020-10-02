import { LooseObject } from "../common/types";
export interface AbiType {
    readonly type: string;
    readonly name: string;
    readonly validation: string;
}
export declare class BaseCoder {
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
