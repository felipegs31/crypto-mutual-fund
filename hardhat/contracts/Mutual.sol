// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./PriceConverter.sol";

contract Mutual is ERC20, Ownable {
    address[] public assetAddresses;
    uint8 public assetQuantity;
    uint256 public minimumUSDJoin;

    uint256 public constant MINIMUM_DEPLOY_USD = 50 * 10**18;

    struct Asset {
        address assetAddress;
        uint8 percentage;
        uint256 initialPrice;
        uint256 balance;
        address chainlinkConversion;
    }

    mapping(address => Asset) public assetsMap;

    constructor(
        address _ethConversionAddress,
        address[] memory _assetAddress,
        address[] memory _assetChainlinkConversion,
        uint8[] memory _assetPercentage,
        uint256 _minimumUSDJoin
    ) ERC20("Mutual Fund Token", "MFT") payable {
        
        console.log('MINIMUM_DEPLOY_USD', MINIMUM_DEPLOY_USD);
        console.log('PriceConverter.getConversionEthRate', PriceConverter.getConversionEthRate(_ethConversionAddress, msg.value));

        require(PriceConverter.getConversionEthRate(_ethConversionAddress, msg.value) >= MINIMUM_DEPLOY_USD, "You need to spend more ETH!");

        require(
            _assetAddress.length == _assetPercentage.length,
            "Assets address and percentage length are different"
        );

        require(
            _assetAddress.length == _assetChainlinkConversion.length,
            "Assets address and _assetChainlinkConversion length are different"
        );

        uint totalPercentage = 0;

        for (uint8 i = 0; i < _assetPercentage.length; i++) {
            totalPercentage += _assetPercentage[i];
        }

        require(totalPercentage == 100, "Percentages doest add to 100%");

        minimumUSDJoin = _minimumUSDJoin * 10**18;
        assetQuantity = uint8(_assetAddress.length);

        for (uint8 i = 0; i < _assetAddress.length; i++) {
            assetAddresses.push(_assetAddress[i]);
            Asset storage asset = assetsMap[_assetAddress[i]];
            asset.assetAddress = _assetAddress[i];
            asset.percentage = _assetPercentage[i];
            asset.initialPrice = PriceConverter.getPrice(
                _assetChainlinkConversion[i]
            );
            asset.balance = 0;
            asset.chainlinkConversion = _assetChainlinkConversion[i];
        }
    }

    /**
     * @dev joinFund `amount` number of CryptoDevTokens
     * Requirements:
     * - `msg.value` should be equal or greater than the tokenPrice * amount
     */
    // function joinFund() public payable {
    //     // the value of ether that should be equal or greater than tokenPrice * amount;
    //     uint256 _requiredAmount = tokenPrice * amount;
    //     require(msg.value >= _requiredAmount, "Ether sent is incorrect");
    //     // total tokens + amount <= 10000, otherwise revert the transaction
    //     uint256 amountWithDecimals = amount * 10**18;
    //     require(
    //         (totalSupply() + amountWithDecimals) <= maxTotalSupply,
    //         "Exceeds the max total supply available."
    //     );
    //     // call the internal function from Openzeppelin's ERC20 contract
    //     _mint(msg.sender, amountWithDecimals);
    // }

    receive() external payable {}

    fallback() external payable {}
}
