import blueDiamond from "../animations/diamond/blue-diamond.json";
import pinkDiamond from "../animations/diamond/pink-diamond.json";
import defaultDiamond from "../animations/diamond/default-diamond.json";
import transparentDiamond from "../animations/diamond/transparent-diamond.json";

const getPackageEmoji = (packageOrder = 0) => {
  if (packageOrder === 0) return pinkDiamond;
  if (packageOrder === 1) return transparentDiamond;
  if (packageOrder === 2) return blueDiamond;
  return defaultDiamond;
};

export { getPackageEmoji };
