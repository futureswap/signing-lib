import { utils } from 'ethers'
import { LooseObject } from '../common/types'
import { checkDefined } from '../common/preconditions'

export interface AbiType {
  readonly type: string
  readonly name: string
  readonly validation: string
}

export class BaseCoder {
  protected decode(packedMessage: string, abiType: ReadonlyArray<AbiType>) {
    const coder = new utils.AbiCoder()
    const abiTypeArray = this.getAbiTypes(abiType)
    const data = coder.decode(abiTypeArray, packedMessage)
    const message = this.destructureData(abiType, data)
    const validationRule = this.computeValiationRule(abiType)

    return {
      message,
      validationRule,
    }
  }

  protected destructureData(
    abiArray: ReadonlyArray<AbiType>,
    data: ReadonlyArray<any>,
  ): any {
    const message = {} as LooseObject

    for (let i = 0; i < abiArray.length; i++) {
      message[abiArray[i].name] = data[i]
    }

    return message
  }

  protected async encode(
    message: LooseObject,
    signRequest: (messageHashBytes: Uint8Array) => Promise<string>,
    abiType: ReadonlyArray<AbiType>,
  ): Promise<{ packedMessage: string; signature: string }> {
    const packedMessage = this.packData(abiType, message)
    const messageHash = utils.keccak256(packedMessage)
    const messageArray = utils.arrayify(messageHash)
    const signature = await signRequest(messageArray)
    return { packedMessage, signature }
  }

  protected packData(abiArray: ReadonlyArray<AbiType>, message: LooseObject) {
    const abiTypes = this.getAbiTypes(abiArray)
    const valueArray = this.createValueArray(abiArray, message)
    const coder = new utils.AbiCoder()

    return coder.encode(abiTypes, valueArray)
  }

  protected getAbiTypes(abiArray: ReadonlyArray<AbiType>) {
    return abiArray.map((t) => t.type)
  }

  protected createValueArray(
    abiArray: ReadonlyArray<AbiType>,
    message: LooseObject,
  ) {
    const array = new Array(abiArray.length)

    for (let i = 0; i < abiArray.length; i++) {
      array[i] = checkDefined(message[abiArray[i].name], abiArray[i].name)
    }

    return array
  }

  protected computeValiationRule(abiArray: ReadonlyArray<AbiType>) {
    const valiationRule = {} as LooseObject

    for (let i = 0; i < abiArray.length; i++) {
      valiationRule[abiArray[i].name] = abiArray[i].validation
    }

    return valiationRule
  }
}
