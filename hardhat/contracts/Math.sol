// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

library Math {
    function floatDiv(uint256 numerator, uint256 denominator)
        internal
        pure
        returns (uint256, uint256)
    {
        uint256 aScaled = numerator * 10**10;
        uint256 divScaled = aScaled / denominator; // b is not scaled!

        uint256 decN = divScaled / 10**10;
        uint256 decFrac = divScaled % 10**10;

        return (decN, decFrac);
    }

    function floatMult(
        uint256 number,
        uint256 decN,
        uint256 decFrac
    ) internal pure returns (uint256) {
        uint8 decFracDigits = numDigits(decFrac);

        uint256 numberInteger = number * decN;
        uint256 numberFrac = (number * decFrac) /
            (10**10 * 1**(10 - decFracDigits));

        uint256 numberFinal = numberInteger + numberFrac;

        return numberFinal;
    }

    function numDigits(uint256 number) internal pure returns (uint8) {
        uint8 digits = 0;
        //if (number < 0) digits = 1; // enable this line if '-' counts as a digit
        while (number != 0) {
            number /= 10;
            digits++;
        }
        return digits;
    }
}
