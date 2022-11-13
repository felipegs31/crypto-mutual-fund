// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./PriceConverter.sol";
import "./Math.sol";
import "./Uniswap.sol";


contract Mutual is ERC20, Ownable, Uniswap {
    address[] public assetAddresses;
    uint8 public assetQuantity;
    uint256 public minimumUSDJoin;
    address public ethConversionAddress;
    uint256 public initialTotalValue;

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
        address _uniswapRouterAddress
    )
        payable
        ERC20(string.concat("CF ", _coinName), string.concat("CF", _coinSymbol))
        Uniswap(_uniswapRouterAddress)
    {

        minimumUSDJoin = _minimumUSDJoin * 10**18;
        uint256 usdAmount = PriceConverter.getConversionEthRate(
                _ethConversionAddress,
                msg.value
            );

        require(
            usdAmount >= MINIMUM_DEPLOY_USD,
            "You need to spend more ETH!"
        );

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

            initialTotalValue +=
                (_assetPercentage[i] * asset.initialPrice) /
                100;
        }
        buyAssets();
        _mint(msg.sender, usdAmount);
    }

    function joinFund() public payable {
        uint256 usdAmount = PriceConverter.getConversionEthRate(
            ethConversionAddress,
            msg.value
        );

        require(usdAmount >= minimumUSDJoin, "You need to deposit more ETH!");

        uint256 usdAmountAfterTax = usdAmount;

        (uint256 decN, uint256 decFrac) = calculateShareValue();

        uint256 erc20TokensToIssue = Math.floatMult(
            usdAmountAfterTax,
            decN,
            decFrac
        );

        buyAssets();
        _mint(msg.sender, erc20TokensToIssue);
    }

    function getAmountOfTokensWillBeSold(uint256 _amountToSell) public view returns (uint256[] memory) {
        require(_amountToSell > 0, "_amountToSell should be greater than zero");
        // get total ERC20 tokens issued
        uint256 totalSupply = totalSupply();

        address sender = msg.sender;
        // Get the number of ERC20 held by a given sender address
        uint256 balance = balanceOf(sender);

        require(balance >= _amountToSell, "_amountToSell should be greater than your balance");

        // Divide the total quantity of ERC20 by the amount been sold
        (uint256 decN, uint256 decFrac) = Math.floatDiv(
            balance,
            totalSupply
        );

        uint256[] memory minBuyQuantity = new uint256[](assetAddresses.length);

        for (uint8 i = 0; i < assetAddresses.length; i++) {
            Asset storage asset = assetsMap[assetAddresses[i]];

            // sell the same percentage of ERC20 and Asset
            uint256 quantityToSell = Math.floatMult(
                asset.balance,
                decN,
                decFrac
            );

            uint256 minBuy = getAmountOutMinBuyEth(
                asset.assetAddress,
                quantityToSell
            );

            minBuyQuantity[i] = minBuy;
        }

        return minBuyQuantity;
    }

    function exitFund(uint256 _amountToSell) public payable {
        require(_amountToSell > 0, "_amountToSell should be greater than zero");
        // get total ERC20 tokens issued
        uint256 totalSupply = totalSupply();

        address sender = msg.sender;
        // Get the number of ERC20 held by a given sender address
        uint256 balance = balanceOf(sender);

        require(balance >= _amountToSell, "_amountToSell should be greater than your balance");

        // Divide the total quantity of ERC20 by the amount been sold
        (uint256 decN, uint256 decFrac) = Math.floatDiv(
            balance,
            totalSupply
        );

        uint256 ethToSendToUser = 0;

        for (uint8 i = 0; i < assetAddresses.length; i++) {
            Asset storage asset = assetsMap[assetAddresses[i]];

            // sell the same percentage of ERC20 and Asset
            uint256 quantityToSell = Math.floatMult(
                asset.balance,
                decN,
                decFrac
            );

            uint256 minBuy = getAmountOutMinBuyEth(
                asset.assetAddress,
                quantityToSell
            );

            require(ERC20(asset.assetAddress).approve(address(uniswapRouter), quantityToSell), 'approve failed.');

            uint256 amounts = swapExactTokensForETH(
                quantityToSell,
                asset.assetAddress,
                minBuy,
                address(this)
            );

            asset.balance -= quantityToSell;
            ethToSendToUser += amounts;

        }

        _burn(sender, _amountToSell);
        payable(msg.sender).transfer(ethToSendToUser);
    }

    function calculateShareValue() public view returns (uint256, uint256) {
        // we need to multiply the quantity of eacht token by its price and then devide by the quantity of shares now to get the price of 1 share at this moment
        uint256 currentTotalValue = 0;

        for (uint8 i = 0; i < assetAddresses.length; i++) {
            Asset memory asset = assetsMap[assetAddresses[i]];
            currentTotalValue += ((asset.balance * PriceConverter.getPrice(asset.chainlinkConversion)) / 1000000000000000000);
        }

        uint256 sharesTotalSupply = totalSupply();

        (uint256 decN, uint256 decFrac) = Math.floatDiv(
            currentTotalValue,
            sharesTotalSupply
        );

        return (decN, decFrac);
    }

    function buyAssets() private {
        uint256 totalEthToBuy = address(this).balance;

        for (uint8 i = 0; i < assetAddresses.length; i++) {
            Asset storage asset = assetsMap[assetAddresses[i]];
            uint256 quantityOfEthToBuy = (asset.percentage * totalEthToBuy) / 100;

            uint256 minBuy = getAmountOutMinSellEth(
                asset.assetAddress,
                quantityOfEthToBuy
            );

            uint256 amounts = swapExactETHForTokens(
                quantityOfEthToBuy,
                asset.assetAddress,
                minBuy,
                address(this)
            );

            asset.balance += amounts;
        }
    }


    receive() external payable {}

    fallback() external payable {}
}
 