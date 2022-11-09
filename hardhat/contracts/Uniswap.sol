// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Uniswap {
    IUniswapV2Router02 public uniswapRouter;

    constructor(address _uniswapRouterAddress) {
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
    }

    function getPathUniswap(address _contract)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = _contract;

        return path;
    }

    function getAmountOutMin(address _tokenOut, uint256 _amountIn)
        public
        view
        returns (uint256)
    {
        address[] memory path = getPathUniswap(_tokenOut);

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
        address[] memory path = getPathUniswap(_tokenOut);

        uint[] memory swap = uniswapRouter.swapExactETHForTokens{
            value: _ethQuantity
        }(_amountOutMin, path, _to, block.timestamp);

        return swap[swap.length - 1];
    }
}