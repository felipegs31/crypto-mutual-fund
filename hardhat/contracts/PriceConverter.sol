// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(address chainlinkConversion) internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            chainlinkConversion
        );
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // ETH/USD rate in 18 digit
        return uint256(answer * 10000000000);
    }

    function getConversionEthRate(address eth2UsdChainlinkConversion, uint256 ethAmount)
        internal
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice(eth2UsdChainlinkConversion); // Eth contract in Goerli
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        return ethAmountInUsd;
    }
}
