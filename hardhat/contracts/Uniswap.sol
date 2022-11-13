// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "hardhat/console.sol";

contract Uniswap {
    IUniswapV2Router02 public uniswapRouter;

    constructor(address _uniswapRouterAddress) {
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
    }

    function getPathSellEthUniswap(address _address)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = _address;

        return path;
    }

    function getPathBuyEthUniswap(address _address)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = _address;
        path[1] = uniswapRouter.WETH();

        return path;
    }

    function getAmountOutMinSellEth(address _tokenOut, uint256 _amountIn)
        public
        view
        returns (uint256)
    {
        address[] memory path = getPathSellEthUniswap(_tokenOut);

        uint256[] memory amountOutMins = uniswapRouter.getAmountsOut(
            _amountIn,
            path
        );
        return amountOutMins[amountOutMins.length - 1];
    }

    function swapExactETHForTokens(
        uint _ethQuantity,
        address _tokenOut,
        uint256 _amountOutMin,
        address _to
    ) public returns (uint amounts) {
        address[] memory path = getPathSellEthUniswap(_tokenOut);

        uint[] memory swap = uniswapRouter.swapExactETHForTokens{
            value: _ethQuantity
        }(_amountOutMin, path, _to, block.timestamp);

        return swap[swap.length - 1];
    }

    function getAmountOutMinBuyEth(address _tokenOut, uint256 _amountIn)
        public
        view
        returns (uint256)
    {
        address[] memory path = getPathBuyEthUniswap(_tokenOut);

        uint256[] memory amountOutMins = uniswapRouter.getAmountsOut(
            _amountIn,
            path
        );

        return amountOutMins[amountOutMins.length - 1];
    }

    function swapExactTokensForETH(
        uint _amountIn,
        address _tokenIn,
        uint256 _amountOutMin,
        address _to
    ) public returns (uint amounts) {
        address[] memory path = getPathBuyEthUniswap(_tokenIn);

        uint[] memory swap = uniswapRouter.swapExactTokensForETH(_amountIn, _amountOutMin, path, _to, block.timestamp);

        return swap[swap.length - 1];
    }
}