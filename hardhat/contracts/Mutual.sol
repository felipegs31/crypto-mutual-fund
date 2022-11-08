// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./PriceConverter.sol";
import "./Math.sol";
import "./ITokenSwap.sol";


contract Mutual is ERC20, Ownable {
    address[] public assetAddresses;
    uint8 public assetQuantity;
    uint256 public minimumUSDJoin;
    address public ethConversionAddress;
    uint256 public initialTotalValue;
    address public tokenSwapContract;

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
        uint256 _minimumUSDJoin,
        string memory _coinName, 
        string memory _coinSymbol,
        address _tokenSwapContract
    ) ERC20(string.concat("CF ", _coinName), string.concat("CF", _coinSymbol)) payable {
        
        require(PriceConverter.getConversionEthRate(_ethConversionAddress, msg.value) >= MINIMUM_DEPLOY_USD, "You need to spend more ETH!");

        require(
            _assetAddress.length == _assetPercentage.length,
            "Assets address and percentage length are different"
        );

        require(
            _assetAddress.length == _assetChainlinkConversion.length,
            "Assets address and _assetChainlinkConversion length are different"
        );


        tokenSwapContract = ITokenSwap(_tokenSwapContract);

        uint totalPercentage = 0;

        for (uint8 i = 0; i < _assetPercentage.length; i++) {
            totalPercentage += _assetPercentage[i];
        }

        require(totalPercentage == 100, "Percentages doest add to 100%");

        minimumUSDJoin = _minimumUSDJoin * 10**18;
        assetQuantity = uint8(_assetAddress.length);
        ethConversionAddress = _ethConversionAddress;

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

            initialTotalValue += (_assetPercentage[i] * asset.initialPrice)/100;
        }
    }

    function joinFund() public payable {

        uint256 usdAmount = PriceConverter.getConversionEthRate(ethConversionAddress, msg.value);

        require(usdAmount >= minimumUSDJoin, "You need to deposit more ETH!");

        uint256 usdAmountAfterTax = usdAmount * 90 / 100;

        (uint256 decN, uint256 decFrac) = calculateCoinReturn();

        uint256 erc20TokensToIssue = Math.floatMult(usdAmountAfterTax, decN, decFrac);

        console.log('erc20TokensToIssue', erc20TokensToIssue);

        _mint(msg.sender, erc20TokensToIssue);
    }

    function calculateCoinReturn() public view returns (uint256, uint256) {
        uint256 currentTotalValue = 0;

        for (uint8 i = 0; i < assetAddresses.length; i++) {
            Asset memory asset = assetsMap[assetAddresses[i]];

            currentTotalValue += (asset.percentage * PriceConverter.getPrice(asset.chainlinkConversion))/100;
        }

        (uint256 decN, uint256 decFrac) = Math.floatDiv(initialTotalValue, currentTotalValue);

        return (decN, decFrac);
    }

    function buyAssets() public {
        uint256 totalEthToBuy = address(this).balance * 90 / 100;

        uint[] memory ethPerAsset = new uint[](assetQuantity);

        console.log('address(this)', address(this));
        console.log('totalEthToBuy', totalEthToBuy);

        for (uint8 i = 0; i < assetAddresses.length; i++) {
            Asset memory asset = assetsMap[assetAddresses[i]];
            ethPerAsset[i] = (asset.percentage * totalEthToBuy)/100;
            console.log('--------------------------');
            console.log('ethPerAsset[i]', ethPerAsset[i]);
            console.log('asset.assetAddress', asset.assetAddress);
            console.log('asset.percentage', asset.percentage);

            uint256 minBuy = ITokenSwap(tokenSwapContract).getAmountOutMin(asset.assetAddress, ethPerAsset[i]);
            console.log('minBuy', minBuy);

            uint[] memory amounts = ITokenSwap(tokenSwapContract).swapEth{
                value: ethPerAsset[i]
            }(asset.assetAddress, minBuy, address(this));

             for (uint8 j = 0; j < amounts.length; j++) {
                console.log('amounts', amounts[j]);
             }
        }

        console.log('address(this).balance AFTER', address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
