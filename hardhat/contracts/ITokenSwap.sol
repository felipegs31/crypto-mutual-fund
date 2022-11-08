// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ITokenSwap {
    function getAmountOutMin(address _tokenOut, uint256 _amountIn)
        external
        view
        returns (uint256);

    function swapEth(
        address _tokenOut,
        uint256 _amountOutMin,
        address _to
    ) external payable returns (uint[] memory amounts);
}