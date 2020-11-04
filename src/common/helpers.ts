import { utils } from "ethers";

export const userInteractionNumberRandom = () => {
    return utils.hexStripZeros(utils.hexlify(utils.randomBytes(31)) + "01");
  };