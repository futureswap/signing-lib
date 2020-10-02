import {BigNumber} from 'ethers';

export const bN2BI = (bigNumber: BigNumber) => {
  return BigInt(bigNumber.toHexString());
};

export const bI2BN = (bigInt: BigInt) => {
  return BigNumber.from(bigInt);
};

export const dateToBN = (date: Date) => {
  // TODO check range of date
  return BigNumber.from(date.getTime());
};
